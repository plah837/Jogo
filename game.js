const canvas = document.getElementById("game-canvas");

if (!canvas) {
  console.warn("Canvas #game-canvas não encontrado.");
} else {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8ec5ff);
  scene.fog = new THREE.Fog(0x8ec5ff, 30, 130);

  const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.set(0, 7, 12);

  const clock = new THREE.Clock();

  let cameraYaw = 0;
  let cameraPitch = 0.35;
  let isDraggingCamera = false;
  let lastTouchX = 0;
  let lastTouchY = 0;

  canvas.style.touchAction = "none";

  canvas.addEventListener("pointerdown", (event) => {
    isDraggingCamera = true;
    lastTouchX = event.clientX;
    lastTouchY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!isDraggingCamera) return;

    const deltaX = event.clientX - lastTouchX;
    const deltaY = event.clientY - lastTouchY;

    lastTouchX = event.clientX;
    lastTouchY = event.clientY;

    cameraYaw -= deltaX * 0.008;
    cameraPitch -= deltaY * 0.006;

    cameraPitch = THREE.MathUtils.clamp(cameraPitch, -0.2, 1.1);
  });

  canvas.addEventListener("pointerup", (event) => {
    isDraggingCamera = false;
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointercancel", () => {
    isDraggingCamera = false;
  });

  const hemiLight = new THREE.HemisphereLight(0xbfe3ff, 0x4d3d2a, 1.1);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfff1d1, 1.2);
  sunLight.position.set(12, 20, 10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.left = -30;
  sunLight.shadow.camera.right = 30;
  sunLight.shadow.camera.top = 30;
  sunLight.shadow.camera.bottom = -30;
  scene.add(sunLight);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
      color: 0x4a7a3a,
      roughness: 1
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const path = new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x7a7d86 })
  );
  path.position.set(0, 0.12, 8);
  path.receiveShadow = true;
  scene.add(path);

  const player = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xf1d1b5 });
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xf1d1b5 });
  const outfitMaterial = new THREE.MeshStandardMaterial({ color: 0x2d8cff });
  const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x5b3a2a });

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.8, 1.6, 4, 8),
    bodyMaterial
  );
  body.castShadow = true;
  body.position.y = 1.6;
  player.add(body);

  const outfit = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.3, 0.5),
    outfitMaterial
  );
  outfit.position.y = 1.8;
  outfit.castShadow = true;
  player.add(outfit);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.52, 18, 18),
    headMaterial
  );
  head.position.y = 3.0;
  head.castShadow = true;
  player.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 18, 18),
    hairMaterial
  );
  hair.position.y = 3.35;
  hair.scale.set(1.04, 0.68, 1.02);
  hair.castShadow = true;
  player.add(hair);

  const weapon = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 1.4, 0.18),
    new THREE.MeshStandardMaterial({ color: 0xd9dfe7 })
  );
  weapon.position.set(0.85, 1.9, 0.2);
  weapon.rotation.z = 0.6;
  weapon.castShadow = true;
  player.add(weapon);

  player.position.set(0, 0, 0);
  scene.add(player);

  const wings = new THREE.Group();
  const wingMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f4ff,
    transparent: true,
    opacity: 0.9
  });

  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 0.12), wingMaterial);
  leftWing.position.set(-1.1, 2.3, 0.2);
  leftWing.rotation.z = 0.5;
  wings.add(leftWing);

  const rightWing = leftWing.clone();
  rightWing.position.x = 1.1;
  rightWing.rotation.z = -0.5;
  wings.add(rightWing);

  wings.visible = false;
  player.add(wings);

  const horns = new THREE.Group();
  const hornMaterial = new THREE.MeshStandardMaterial({ color: 0x4f4f64 });

  const horn1 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.7, 6), hornMaterial);
  horn1.position.set(-0.22, 3.5, 0);
  horn1.rotation.z = -0.5;
  horns.add(horn1);

  const horn2 = horn1.clone();
  horn2.position.x = 0.22;
  horn2.rotation.z = 0.5;
  horns.add(horn2);

  horns.visible = false;
  player.add(horns);

  const npcs = [];
  const npcMaterial = new THREE.MeshStandardMaterial({ color: 0xf4d5a6 });

  for (let i = 0; i < 6; i++) {
    const npcGroup = new THREE.Group();

    const bodyNpc = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.5, 1.2, 4, 8),
      npcMaterial
    );
    bodyNpc.position.y = 1.2;
    npcGroup.add(bodyNpc);

    const headNpc = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xf1d1b5 })
    );
    headNpc.position.y = 2.2;
    npcGroup.add(headNpc);

    const baseX = -18 + i * 7;
    const baseZ = 16 + (i % 2) * 10;
    npcGroup.position.set(baseX, 0, baseZ);
    scene.add(npcGroup);

    npcs.push(npcGroup);
  }

  const monsters = [];
  const monsterMaterial = new THREE.MeshStandardMaterial({ color: 0x7f1d1d });

  for (let i = 0; i < 8; i++) {
    const monster = new THREE.Group();

    const bodyM = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.55, 1.3, 4, 8),
      monsterMaterial
    );
    bodyM.position.y = 1.1;
    monster.add(bodyM);

    const horn1m = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.7, 6),
      new THREE.MeshStandardMaterial({ color: 0x1f2937 })
    );
    horn1m.position.set(-0.2, 2.4, 0);
    horn1m.rotation.z = -0.5;
    monster.add(horn1m);

    const horn2m = horn1m.clone();
    horn2m.position.x = 0.2;
    horn2m.rotation.z = 0.5;
    monster.add(horn2m);

    monster.position.set(-24 + i * 7, 0, -18 + (i % 3) * 12);
    scene.add(monster);
    monsters.push(monster);
  }

  const castleGroup = new THREE.Group();
  const towerMaterial = new THREE.MeshStandardMaterial({ color: 0x9197a5 });
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x7b7f87 });

  for (let i = 0; i < 4; i++) {
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 2.2, 8, 8),
      towerMaterial
    );
    tower.position.set(-18 + i * 12, 4, -32);
    tower.castShadow = true;
    tower.receiveShadow = true;
    castleGroup.add(tower);
  }

  const castleWall = new THREE.Mesh(
    new THREE.BoxGeometry(30, 4, 16),
    wallMaterial
  );
  castleWall.position.set(0, 2, -33);
  castleWall.castShadow = true;
  castleWall.receiveShadow = true;
  castleGroup.add(castleWall);

  const castleGate = new THREE.Mesh(
    new THREE.BoxGeometry(7, 4, 2),
    new THREE.MeshStandardMaterial({ color: 0x3b2e26 })
  );
  castleGate.position.set(0, 2, -24.5);
  castleGate.castShadow = true;
  castleGroup.add(castleGate);

  scene.add(castleGroup);

  const dungeonPortal = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.35, 16, 40),
    new THREE.MeshStandardMaterial({
      color: 0x6c2bd9,
      emissive: 0x3b0f6a,
      emissiveIntensity: 1.4
    })
  );
  dungeonPortal.rotation.x = Math.PI / 2;
  dungeonPortal.position.set(18, 1.8, -6);
  scene.add(dungeonPortal);

  const trees = [];
  for (let i = 0; i < 30; i++) {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.35, 2.3, 8),
      new THREE.MeshStandardMaterial({ color: 0x6c4227 })
    );
    trunk.position.y = 1.15;
    tree.add(trunk);

    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x2d6d36 })
    );
    leaves.position.y = 2.8;
    tree.add(leaves);

    const x = (Math.random() - 0.5) * 80;
    const z = (Math.random() - 0.5) * 80;
    tree.position.set(x, 0, z);

    if (Math.abs(x) < 10 && Math.abs(z) < 10) continue;

    scene.add(tree);
    trees.push(tree);
  }

  const moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false
  };

  const handleKey = (code, isPressed) => {
    switch (code) {
      case "KeyW":
      case "ArrowUp":
        moveState.forward = isPressed;
        break;
      case "KeyS":
      case "ArrowDown":
        moveState.backward = isPressed;
        break;
      case "KeyA":
      case "ArrowLeft":
        moveState.left = isPressed;
        break;
      case "KeyD":
      case "ArrowRight":
        moveState.right = isPressed;
        break;
    }
  };

  window.addEventListener("keydown", (e) => handleKey(e.code, true));
  window.addEventListener("keyup", (e) => handleKey(e.code, false));

  const mobileButtons = {
    up: document.getElementById("move-up"),
    down: document.getElementById("move-down"),
    left: document.getElementById("move-left"),
    right: document.getElementById("move-right")
  };

  Object.entries(mobileButtons).forEach(([key, button]) => {
    if (!button) return;

    const setTouch = (pressed) => {
      if (key === "up") moveState.forward = pressed;
      if (key === "down") moveState.backward = pressed;
      if (key === "left") moveState.left = pressed;
      if (key === "right") moveState.right = pressed;
    };

    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      setTouch(true);
    });

    button.addEventListener("touchend", () => setTouch(false));
    button.addEventListener("touchcancel", () => setTouch(false));
    button.addEventListener("mousedown", () => setTouch(true));
    button.addEventListener("mouseup", () => setTouch(false));
    button.addEventListener("mouseleave", () => setTouch(false));
  });

  function updateWeaponVisual(weaponType) {
    weapon.scale.set(1, 1, 1);
    weapon.rotation.z = 0.6;
    weapon.rotation.x = 0;

    if (weaponType === "bow") {
      weapon.geometry = new THREE.BoxGeometry(0.12, 1.5, 0.12);
      weapon.position.set(0.9, 1.9, 0.25);
    } else if (weaponType === "sword") {
      weapon.geometry = new THREE.BoxGeometry(0.18, 2.2, 0.18);
      weapon.position.set(0.8, 2.1, 0.2);
      weapon.rotation.z = 1.1;
    } else if (weaponType === "axe") {
      weapon.geometry = new THREE.BoxGeometry(0.3, 1.8, 0.2);
      weapon.position.set(0.8, 2.0, 0.2);
      weapon.rotation.z = 0.85;
    } else if (weaponType === "staff") {
      weapon.geometry = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 8);
      weapon.position.set(0.75, 1.9, 0.2);
      weapon.rotation.z = 0.1;
    }
  }

  window.applyCharacterAppearance = function (data) {
    if (!data) return;

    const skin = new THREE.Color(data.skinColor || "#f1d1b5");
    const hair = new THREE.Color(data.hairColor || "#5b3a2a");
    const cloth = new THREE.Color(data.clothColor || "#2d8cff");

    bodyMaterial.color.copy(skin);
    headMaterial.color.copy(skin);
    outfitMaterial.color.copy(cloth);
    hairMaterial.color.copy(hair);

    const selectedRace = (data.race || "elfo").toLowerCase();
    wings.visible = selectedRace === "anjo";
    horns.visible = selectedRace === "demonio";

    if (selectedRace === "elfo") {
      hair.scale.set(1.04, 0.68, 1.02);
    } else if (selectedRace === "anjo") {
      hair.scale.set(1.0, 0.8, 1.0);
    } else if (selectedRace === "demonio") {
      hair.scale.set(1.06, 0.72, 1.0);
    }

    updateWeaponVisual(data.weapon || "bow");
  };

  function animate() {
    const delta = clock.getDelta();
    const speed = 7.5;

    let dirX = 0;
    let dirZ = 0;

    if (moveState.forward) dirZ -= 1;
    if (moveState.backward) dirZ += 1;
    if (moveState.left) dirX -= 1;
    if (moveState.right) dirX += 1;

    if (dirX !== 0 || dirZ !== 0) {
      const length = Math.hypot(dirX, dirZ) || 1;
      dirX /= length;
      dirZ /= length;

      player.position.x += dirX * speed * delta;
      player.position.z += dirZ * speed * delta;

      const angle = Math.atan2(dirX, dirZ);
      player.rotation.y = angle;
    }

    player.position.x = THREE.MathUtils.clamp(player.position.x, -42, 42);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -42, 42);

    const cameraDistance = 12;
    const offset = new THREE.Vector3(
      Math.sin(cameraYaw) * cameraDistance,
      5 + cameraPitch * 5,
      Math.cos(cameraYaw) * cameraDistance
    );

    const desiredCameraPosition = player.position.clone().add(offset);
    camera.position.lerp(desiredCameraPosition, 1.2 * delta);
    camera.lookAt(player.position.x, player.position.y + 2, player.position.z);

    npcs.forEach((npc, index) => {
      const t = performance.now() * 0.001 + index;
      npc.position.x += Math.sin(t * 0.7) * 0.004;
      npc.position.z += Math.cos(t * 0.8) * 0.004;
    });

    monsters.forEach((monster, index) => {
      const t = performance.now() * 0.001 + index;
      monster.position.x += Math.sin(t * 0.9) * 0.012;
      monster.rotation.y += 0.01;
    });

    dungeonPortal.rotation.z += 0.02;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  });

  window.applyCharacterAppearance({
    name: "Aventureiro",
    race: "elfo",
    skinColor: "#f1d1b5",
    hairColor: "#5b3a2a",
    clothColor: "#2d8cff",
    weapon: "bow"
  });
}
