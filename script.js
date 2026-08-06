const startBtn = document.getElementById('start-btn');
const welcomeScreen = document.getElementById('welcome-screen');

const bgMusic = document.getElementById('bg-music');
const poemMusic = document.getElementById('poem-music');
const jokeMusic = document.getElementById('joke-music');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.getElementById('close-btn');

function stopAllMusic() {
  bgMusic.pause();
  poemMusic.pause();
  jokeMusic.pause();
}

function playTrack(audioEl) {
  stopAllMusic();
  audioEl.currentTime = 0;
  audioEl.play().catch(e => console.log("Audio bloqué ou absent", e));
}

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  modalBody.innerHTML = '';
  playTrack(bgMusic);
});

startBtn.addEventListener('click', () => {
  welcomeScreen.style.display = 'none';
  playTrack(bgMusic);
  initGalaxy();
});

function initGalaxy() {
  const container = document.getElementById('canvas-container');
  const scene = new THREE.Scene();

  const devTag = document.createElement('div');
  devTag.style.position = 'absolute';
  devTag.style.top = '20px';
  devTag.style.left = '20px';
  devTag.style.color = '#ff69b4';
  devTag.style.fontFamily = "'Segoe UI', sans-serif";
  devTag.style.fontSize = '1rem';
  devTag.style.fontWeight = 'bold';
  devTag.style.letterSpacing = '2px';
  devTag.style.textShadow = '0 0 10px #ff1493';
  devTag.style.zIndex = '5';
  devTag.innerHTML = '⚡ Osnyl.Dev';
  document.body.appendChild(devTag);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2.5, 5);
  camera.lookAt(0, 0.3, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const particlesCount = 7000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    const radius = Math.random() * 4.5 + 0.4;
    const spinAngle = radius * 4;
    const branchAngle = ((i % 3) * 2 * Math.PI) / 3;

    positions[i] = Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 0.3;
    positions[i + 1] = (Math.random() - 0.5) * 0.2;
    positions[i + 2] = Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 0.3;

    colors[i] = 1.0;
    colors[i + 1] = Math.random() * 0.3 + 0.1;
    colors[i + 2] = Math.random() * 0.7 + 0.3;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const galaxyMaterial = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  const galaxy = new THREE.Points(geometry, galaxyMaterial);
  scene.add(galaxy);

  const hbdCanvas = document.createElement('canvas');
  const hbdCtx = hbdCanvas.getContext('2d');
  hbdCanvas.width = 300;
  hbdCanvas.height = 150;
  hbdCtx.font = "Bold 90px 'Segoe UI', sans-serif";
  hbdCtx.fillStyle = "#ffffff";
  hbdCtx.textAlign = "center";
  hbdCtx.fillText("HBD", 150, 110);

  const imgData = hbdCtx.getImageData(0, 0, 300, 150);
  const hbdPoints = [];

  for (let y = 0; y < 150; y += 3) {
    for (let x = 0; x < 300; x += 3) {
      const alpha = imgData.data[(y * 300 + x) * 4 + 3];
      if (alpha > 128) {
        const posX = (x - 150) * 0.015;
        const posY = (75 - y) * 0.015 + 1.0;
        const posZ = (Math.random() - 0.5) * 0.4;
        hbdPoints.push(posX, posY, posZ);
      }
    }
  }

  const hbdGeo = new THREE.BufferGeometry();
  hbdGeo.setAttribute('position', new THREE.Float32BufferAttribute(hbdPoints, 3));

  const hbdMat = new THREE.PointsMaterial({
    size: 0.04,
    color: 0xffd700,
    transparent: true,
    opacity: 0.95
  });

  const hbdStars = new THREE.Points(hbdGeo, hbdMat);
  scene.add(hbdStars);

  const heartCount = 1200;
  const heartGeometry = new THREE.BufferGeometry();
  const heartPos = new Float32Array(heartCount * 3);

  for (let i = 0; i < heartCount; i++) {
    const t = Math.PI * 2 * Math.random();
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    const z = (Math.random() - 0.5) * 5;

    const scale = 0.045;
    heartPos[i * 3] = x * scale;
    heartPos[i * 3 + 1] = y * scale - 0.3;
    heartPos[i * 3 + 2] = z * scale;
  }

  heartGeometry.setAttribute('position', new THREE.BufferAttribute(heartPos, 3));
  const heartMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xff1493,
    transparent: true,
    opacity: 0.85
  });

  const heart = new THREE.Points(heartGeometry, heartMaterial);
  scene.add(heart);

  const messages = [
    "Joyeux Anniversaire Fleuryne 🎂",
    "Pour Fleuryne ✨",
    "Mon Étoile 🌌",
    "De la part d'Osnyl ✨"
  ];
  const textGroup = new THREE.Group();
  scene.add(textGroup);

  messages.forEach((msg, idx) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    ctx.font = "Bold 30px 'Segoe UI', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.shadowColor = "#ff69b4";
    ctx.shadowBlur = 12;
    ctx.fillText(msg, canvas.width / 2, canvas.height / 2 + 10);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);

    const angle = (idx / messages.length) * Math.PI * 2;
    const radius = 2.4;
    sprite.position.set(Math.cos(angle) * radius, 0.4, Math.sin(angle) * radius);
    sprite.scale.set(1.6, 0.4, 1);

    textGroup.add(sprite);
  });

  const textureLoader = new THREE.TextureLoader();
  const photoFiles = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'];
  const photosGroup = new THREE.Group();
  scene.add(photosGroup);

  photoFiles.forEach((file, idx) => {
    textureLoader.load(file, (texture) => {
      const geo = new THREE.PlaneGeometry(0.8, 0.8);
      const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);

      const angle = (idx / photoFiles.length) * Math.PI * 2;
      const radius = 2.0;
      mesh.position.set(Math.cos(angle) * radius, -0.2, Math.sin(angle) * radius);
      mesh.rotation.y = -angle + Math.PI / 2;

      photosGroup.add(mesh);
    });
  });

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const interactiveItems = [
    { title: "📜 Poème", type: "poem" },
    { title: "🧩 Devinette", type: "joke" }
  ];

  const cardsGroup = new THREE.Group();
  scene.add(cardsGroup);
  const clickableMeshes = [];

  interactiveItems.forEach((item, idx) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;

    ctx.fillStyle = "#ff1493";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "Bold 22px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(item.title, canvas.width / 2, canvas.height / 2 + 8);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const geo = new THREE.PlaneGeometry(0.8, 0.4);
    const mesh = new THREE.Mesh(geo, mat);

    const angle = (idx / interactiveItems.length) * Math.PI + Math.PI / 4;
    const radius = 1.4;
    mesh.position.set(Math.cos(angle) * radius, -0.6, Math.sin(angle) * radius);
    mesh.rotation.y = -angle;

    mesh.userData = item;
    cardsGroup.add(mesh);
    clickableMeshes.push(mesh);
  });

  window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableMeshes);

    if (intersects.length > 0) {
      const clickedData = intersects[0].object.userData;
      openModal(clickedData);
    }
  });

  function openModal(data) {
    modalTitle.innerText = data.title;
    modalBody.innerHTML = '';

    if (data.type === 'poem') {
      playTrack(poemMusic);
      modalBody.innerHTML = `
        <div class="poem-card">
          <div class="poem-section">
            Fleuryne,<br><br>
            Dans l'immensité de cet univers, il y a des personnes qui apportent une vraie belle énergie, et tu en fais clairement partie.<br>
            Toujours sympa, toujours réactive... Franchement, rien à redire, tu gères ! 🌟
          </div>
          
          <hr style="border:0; height:1px; background:linear-gradient(to right, transparent, #ff69b4, transparent); margin:15px 0;">

          <div class="poem-section">
            Sache que je garde toujours un œil sur toi (oui oui, je surveille de près ! 👀)...<br><br>
            Profite à fond de ta journée et fête ça comme il se doit !<br><br>
            ✨ Joyeux Anniversaire ! ✨
          </div>

          <div class="poem-signature">
            — Signé : Osnyl 💖
          </div>
        </div>
      `;
    } else if (data.type === 'joke') {
      playTrack(jokeMusic);
      modalBody.innerHTML = `
        <div class="joke-container">
          <p style="font-size: 1.05rem; line-height: 1.6;">
            🔒 <strong>Devinette :</strong><br><br>
            Qu'est-ce qui est plus brillant qu'une étoile, super sympa, répond toujours ultra vite aux messages, donne de super conseils et qui me doit un gâteau ? 🤔
          </p>
          <input type="text" id="pass-input" class="joke-input" placeholder="Ton prénom...">
          <button id="pass-submit" class="joke-btn">Valider 🔓</button>
          <p id="pass-error" style="color: #ff4757; display: none; font-size: 0.9rem;">Mauvaise réponse 😜 Indice : Ton prénom !</p>
        </div>
      `;

      setTimeout(() => {
        const submitBtn = document.getElementById('pass-submit');
        const passInput = document.getElementById('pass-input');
        const errorMsg = document.getElementById('pass-error');

        submitBtn.addEventListener('click', () => {
          const val = passInput.value.trim().toLowerCase();
          if (val === 'fleuryne' || val === 'fleury') {
            loadJokeStep2();
          } else {
            errorMsg.style.display = 'block';
          }
        });
      }, 100);
    }

    modal.classList.remove('hidden');
  }

  function loadJokeStep2() {
    modalBody.innerHTML = `
      <div class="joke-container">
        <p style="font-size: 1.1rem; color: #ffd700; font-weight: bold;">
          🎉 Mot de passe accepté !
        </p>
        <p>Quel cadeau souhaites-tu commander ? 🎁</p>
        
        <div class="gift-option" data-gift="un joli bracelet 📿">📿 Un joli bracelet</div>
        <div class="gift-option" data-gift="un bon yaourt 🍦">🍦 Un bon yaourt</div>
        <div class="gift-option" data-gift="un gros Shawarma 🌯">🌯 Un gros Shawarma</div>
      </div>
    `;

    const options = modalBody.querySelectorAll('.gift-option');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const chosenGift = opt.getAttribute('data-gift');
        loadJokeStep3(chosenGift);
      });
    });
  }

  function loadJokeStep3(gift) {
    modalBody.innerHTML = `
      <div class="joke-container">
        <p style="font-size: 1.1rem; line-height: 1.5;">
          Excellent choix ! Tu as choisi : <strong>${gift}</strong> !<br><br>
          Es-tu prête à payer la facture ? 💳
        </p>
        
        <div class="payment-area" id="pay-area">
          <button id="yes-btn" class="joke-btn" style="position: absolute; left: 20%; top: 30px;">OUI ! 🤝</button>
          <button id="no-btn" class="joke-btn" style="position: absolute; left: 60%; top: 30px;">NON 😜</button>
        </div>
      </div>
    `;

    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const payArea = document.getElementById('pay-area');

    const moveNoBtn = () => {
      const maxX = payArea.clientWidth - noBtn.clientWidth;
      const maxY = payArea.clientHeight - noBtn.clientHeight;
      const newX = Math.random() * Math.max(0, maxX);
      const newY = Math.random() * Math.max(0, maxY);

      noBtn.style.left = `${newX}px`;
      noBtn.style.top = `${newY}px`;
    };

    noBtn.addEventListener('mouseover', moveNoBtn);
    noBtn.addEventListener('touchstart', moveNoBtn);

    yesBtn.addEventListener('click', () => {
      modalBody.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #ff69b4; font-size: 1.5rem;">C'est super sympa ! 🤝</h2>
          <p style="font-size: 1.2rem; line-height: 1.7; margin-top: 15px;">
            J'attends donc le dépôt 🙂🙂<br><br>
            Merci Fleury ! 😜💸
          </p>
        </div>
      `;
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    galaxy.rotation.y += 0.002;
    hbdStars.rotation.y += 0.003;
    textGroup.rotation.y += 0.003;
    photosGroup.rotation.y += 0.002;
    cardsGroup.rotation.y += 0.002;

    const time = Date.now() * 0.0025;
    const pulse = 1 + Math.sin(time * 2) * 0.07;
    heart.scale.set(pulse, pulse, pulse);
    heart.rotation.y += 0.004;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
