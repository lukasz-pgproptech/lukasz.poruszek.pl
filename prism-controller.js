/**
 * prism-controller.js
 * Kompletny moduł orkiestracji sceny 3 (dawna doniczka) w rozdziale 1 (Science):
 * - Zastępuje doniczkę oryginalnym, fotorealistycznym modelem Prism Stone (Sketchfab PBR).
 * - Przywraca rosnącą roślinę i korzenie (pot3.gltf -> Armature001 / Plant) wyrastające z kryształu.
 * - Przywraca doniczki w tle (bg_pot.gltf -> bgContainer) z teksturami KTX (s3tc/astc).
 * - Zapewnia płynne animacje: wzrost korzeni przy scrollowaniu (incrementalScaleRoots), kołysanie liści (plantBones) i obrót kryształu.
 * - Całkowicie eliminuje ziarna kukurydzy (corn kernels).
 */
(function() {
  const PrismController = {
    prismUrl: '/models/prism/scene.gltf',
    potAssetUrl: '/assets/pot3.gltf',
    bgPotAssetUrl: '/assets/bg_pot.gltf',
    loadedPrismGltf: null,

    // Zweryfikowane parametry idealnego dopasowania i kompozycji
    tuning: {
      desktopScale: 2.6,
      mobileScale: 1.8,
      desktopPosX: 0.8,
      mobilePosX: 0.0,
      desktopPosY: 2.2,
      mobilePosY: 1.0,
      posZ: 3.0,
      plantScale: 0.15,
      plantPosX: -0.15,
      plantPosY: 2.4,
      plantPosZ: 14.0,
      prismPosX: -0.85,
      prismPosY: -1.40,
      prismPosZ: -0.32,
      emissiveIntensity: 1.1,
      lightIntensity: 1.3,
      rotSpeedY: 0.005
    },

    loadModel: function() {
      if (this.loadedPrismGltf) return Promise.resolve(this.loadedPrismGltf);
      return new Promise(function(resolve, reject) {
        if (!window.THREE || !window.THREE.GLTFLoader) {
          return reject(new Error('THREE.GLTFLoader not available yet'));
        }
        var loader = new window.THREE.GLTFLoader();
        loader.load(PrismController.prismUrl, function(gltf) {
          PrismController.loadedPrismGltf = gltf;
          resolve(gltf);
        }, undefined, reject);
      });
    },

    /**
     * Wstrzykuje i konfiguruje pełną scenę doniczki z Prism Stone
     */
    attachToSciencePot: function(potSection) {
      if (!potSection || !potSection.container) return;

      var isMobile = window.innerWidth < 768;
      var fmt = isMobile ? 'astc' : 's3tc';
      var ktxLoader = new window.THREE.KTXLoader();
      var gltfLoader = new window.THREE.GLTFLoader();

      var pTex = new Promise(function(resolve) {
        ktxLoader.load('/compressed/' + fmt + '/pot/diffuse_pot@mipmaps.ktx', resolve, undefined, function() {
          console.warn('[PrismController] Fallback loading pot texture');
          resolve(null);
        });
      });

      var pBgTex = new Promise(function(resolve) {
        ktxLoader.load('/compressed/' + fmt + '/pot/bg_pot_diffuse.ktx', resolve, undefined, function() {
          console.warn('[PrismController] Fallback loading bg pot texture');
          resolve(null);
        });
      });

      var pPot3 = new Promise(function(resolve, reject) {
        gltfLoader.load(PrismController.potAssetUrl, resolve, undefined, reject);
      });

      var pBgPot = new Promise(function(resolve, reject) {
        gltfLoader.load(PrismController.bgPotAssetUrl, resolve, undefined, reject);
      });

      var pPrism = this.loadModel();

      Promise.all([pTex, pBgTex, pPot3, pBgPot, pPrism]).then(function(results) {
        var potTex = results[0];
        var bgPotTex = results[1];
        var pot3Gltf = results[2];
        var bgPotGltf = results[3];
        var prismGltf = results[4];

        var t = PrismController.tuning;

        // 1. Oczyszczenie kontenera ze starych obiektów
        while (potSection.container.children.length > 0) {
          potSection.container.remove(potSection.container.children[0]);
        }
        if (potSection.bgContainer && potSection.bgContainer.parent) {
          potSection.bgContainer.parent.remove(potSection.bgContainer);
        }

        // 2. Konfiguracja kontenera głównego
        potSection.container.rotation.x = -0.5 * Math.PI;
        potSection.container.position.set(
          isMobile ? t.mobilePosX : t.desktopPosX,
          isMobile ? t.mobilePosY : t.desktopPosY,
          t.posZ
        );
        var sc = isMobile ? 0.48 : 0.6;
        potSection.container.scale.set(sc, sc, sc);

        // 3. Prism Stone jako baza/pedestał w precyzyjnej ramie Pot001
        var prismModel = prismGltf.scene.clone(true);
        prismModel.traverse(function(c) {
          if (c.isMesh) {
            c.layers.set(5);
            if (c.material) {
              c.material = c.material.clone();
              c.material.side = window.THREE.DoubleSide;
              c.material.emissiveIntensity = t.emissiveIntensity;
              c.material.roughness = 0.45;
              c.material.metalness = 0.35;
            }
          }
        });

        var prismPivot = new window.THREE.Group();
        prismModel.position.set(0, -0.73, 0);
        prismPivot.add(prismModel);
        prismPivot.rotation.set(0.5 * Math.PI, 0, 0);
        var psc = isMobile ? t.mobileScale : t.desktopScale;
        prismPivot.scale.set(psc, psc, psc);
        prismPivot.position.set(t.prismPosX, t.prismPosY, t.prismPosZ);

        potSection.container.add(prismPivot);
        potSection.mainPotObject = prismPivot;
        potSection.prismPivot = prismPivot;
        potSection.prismModel = prismModel;

        // 4. Roślina i korzenie z pot3.gltf (Armature001 / Plant)
        var mainPlant = pot3Gltf.scene.children[0];
        mainPlant.scale.set(t.plantScale, t.plantScale, t.plantScale);
        mainPlant.position.set(t.plantPosX, t.plantPosY, t.plantPosZ);
        mainPlant.rotation.set(0.5 * Math.PI, 0, 0);

        var plantMesh = mainPlant.children.find(function(c) { return c.isSkinnedMesh; }) || mainPlant.getObjectByProperty('isSkinnedMesh', true);
        if (plantMesh) {
          plantMesh.frustumCulled = false;

          // Całkowita eliminacja ziarna kukurydzy (seed vertices weighted to 'Bone')
          var geom = plantMesh.geometry;
          if (geom && geom.attributes && geom.attributes.position && geom.attributes.skinIndex && geom.attributes.skinWeight) {
            var posAttr = geom.attributes.position;
            var skinIndex = geom.attributes.skinIndex;
            var skinWeight = geom.attributes.skinWeight;
            var bones = plantMesh.skeleton ? plantMesh.skeleton.bones : [];
            var boneIdx = bones.findIndex(function(b) { return b.name === 'Bone'; });
            if (boneIdx !== -1) {
              for (var v_i = 0; v_i < posAttr.count; v_i++) {
                var w0 = skinIndex.getX(v_i) === boneIdx ? skinWeight.getX(v_i) : 0;
                var w1 = skinIndex.getY(v_i) === boneIdx ? skinWeight.getY(v_i) : 0;
                var w2 = skinIndex.getZ(v_i) === boneIdx ? skinWeight.getZ(v_i) : 0;
                var w3 = skinIndex.getW(v_i) === boneIdx ? skinWeight.getW(v_i) : 0;
                if ((w0 + w1 + w2 + w3) > 0.3) {
                  posAttr.setXYZ(v_i, 0, 0, 0);
                }
              }
              posAttr.needsUpdate = true;
            }
          }

          if (potTex) {
            var plantMat = new window.THREE.MeshBasicMaterial({
              map: potTex,
              transparent: true,
              side: window.THREE.DoubleSide,
              alphaTest: 0.5,
              skinning: true
            });
            plantMesh.material = plantMat;
          }
          plantMesh.layers.set(5);
        }

        var boneRoot = mainPlant.children.find(function(c) { return c.isBone; }) || mainPlant.getObjectByProperty('isBone', true);
        potSection.mainBone = boneRoot;
        potSection.mainPlantObject = mainPlant;
        potSection.plantBones = [];

        function setBaseRotation(e, parentObj, list) {
          if (list) list.push(e);
          e.userData.rot = (new window.THREE.Vector3()).copy(e.rotation);
          e.userData.parent = parentObj;
          e.userData.rotSpeed = 0;
          e.userData.levelScale = 0;
          e.userData.rotOffset = 0;
          for (var i = 0; i < e.children.length; i++) {
            setBaseRotation(e.children[i], e, list);
          }
        }

        if (boneRoot) {
          // Inicjalizuj wszystkie kości
          setBaseRotation(boneRoot, null);
          // Do kołysania (plantBones) dodaj WYŁĄCZNIE kości liści (plant -> children[1]), a nie korzenie!
          if (boneRoot.children && boneRoot.children[1]) {
            setBaseRotation(boneRoot.children[1], boneRoot, potSection.plantBones);
          }
        }

        potSection.container.add(mainPlant);

        // 5. Doniczki w tle (bg_pot.gltf)
        var bgPot = bgPotGltf.scene.children[0];
        var bgContainer = new window.THREE.Object3D();
        var bgPot2 = bgPot.clone();
        bgPot.rotation.z = Math.PI;
        bgPot2.position.z = 0;
        bgPot.position.z = -3;
        bgPot2.position.y = 0.46;
        bgPot.position.y = 0.46;
        bgPot.scale.set(0.6, 0.6, 0.6);
        bgPot2.scale.set(0.6, 0.6, 0.6);

        if (bgPotTex) {
          var bgMat = new window.THREE.MeshBasicMaterial({
            map: bgPotTex,
            transparent: true,
            side: window.THREE.DoubleSide,
            alphaTest: 0.2
          });
          bgPot.material = bgMat;
          bgPot2.material = bgMat;
        }

        bgContainer.add(bgPot);
        bgContainer.add(bgPot2);
        potSection.sceneWrapper.add(bgContainer);
        potSection.bgContainer = bgContainer;

        // 6. Dedykowane oświetlenie Warstwy 5
        if (!potSection.pbrLights) {
          potSection.pbrLights = new window.THREE.Group();

          var amb = new window.THREE.AmbientLight(0xffffff, 0.95);
          amb.layers.enable(5);
          potSection.pbrLights.add(amb);

          var dir1 = new window.THREE.DirectionalLight(0x00f0ff, t.lightIntensity);
          dir1.position.set(4, 5, 5);
          dir1.layers.enable(5);
          potSection.pbrLights.add(dir1);

          var dir2 = new window.THREE.DirectionalLight(0xffffff, 0.7);
          dir2.position.set(-4, -2, 4);
          dir2.layers.enable(5);
          potSection.pbrLights.add(dir2);

          potSection.sceneWrapper.add(potSection.pbrLights);
        }

        // 7. Hitbox interakcji kursora
        if (!potSection.hitbox) {
          var boxGeom = new window.THREE.BoxGeometry(1, 0.1, 1.5);
          var boxMat = new window.THREE.MeshBasicMaterial({ color: 0x00ff00, visible: false });
          potSection.hitbox = new window.THREE.Mesh(boxGeom, boxMat);
          potSection.hitbox.position.set(0.2, 0, 2.4);
          potSection.hitbox.layers.set(5);
          potSection.sceneWrapper.add(potSection.hitbox);
        }

        // 8. Wzrost korzeni (incrementalScaleRoots)
        potSection.incrementalScaleRoots = function(e, tVal, n, i, r) {
          if (!e) return;
          var o = Math.max(0, Math.min(r, 10 * tVal - n * i));
          var a = 0.05 * (o - e.userData.levelScale);
          e.userData.rotSpeed += a;
          if (e.userData.parent) e.userData.parent.userData.rotSpeed += 0.1 * e.userData.rotSpeed;
          e.userData.levelScale = o;
          e.scale.set(o, o, o);
          for (var s = 0; s < e.children.length; s++) {
            this.incrementalScaleRoots(e.children[s], tVal, n + 1, i, 1);
          }
        };

        // 9. Aktualizacja postępu przewijania (setProgress) z klamrowaniem Y
        potSection.setProgress = function(e) {
          this.progress = e;
          this.progressSpeed = Math.max(-0.05, Math.min(0.05, this.progress - (this.preProgress || 0)));
          var mob = window.innerWidth < 768;
          var tOff = mob ? 0.03 : 0;
          var isVis = e > 0.05;
          if (this.sceneWrapper) this.sceneWrapper.visible = isVis;
          if (!isVis) return;

          // Płynna pozycja Y ograniczona od -14 do -1 (nigdy nie ucieka poza ekran)
          var n = Math.max(-14, Math.min(-1, -14 + ((e + tOff) / 0.83) * 13));
          this.sceneWrapper.position.y = n;

          if (this.mainPlantObject && this.mainBone && this.mainBone.children) {
            var prog = Math.max(0, Math.min(0.5, ((e + tOff - 0.65) / 0.15) * 0.5));
            if (this.mainBone.children[0] && this.mainBone.children[0].children[0]) {
              this.incrementalScaleRoots(this.mainBone.children[0].children[0], prog, 0, 0.3, 0.9);
            }
            if (this.mainBone.children[0] && this.mainBone.children[0].children[1]) {
              this.incrementalScaleRoots(this.mainBone.children[0].children[1], prog, 0, 0.3, 1.4);
            }
          }
        };

        // 10. Pętla animacji (whileActive): obrót Prism Stone + kołysanie liści od kursora
        potSection.whileActive = function() {
          this.ticker = (this.ticker || 0) + 1;
          if (!this.sceneWrapper || !this.sceneWrapper.visible) return;

          if (this.mainPotObject) {
            this.mainPotObject.rotation.y += PrismController.tuning.rotSpeedY;
          }

          var pointer = window.store && window.store.state && window.store.state.pointer;
          var norm = pointer ? pointer.positionNorm : [0.5, 0.5];
          if (this.plantBones && this.plantBones.length > 0) {
            for (var n = 0; n < this.plantBones.length; n++) {
              var bone = this.plantBones[n];
              var ud = bone.userData;
              if (ud) {
                ud.rotSpeed += 0.001 * Math.sin(0.02 * this.ticker + 0.5 * Math.PI) * (n / (0.5 * this.plantBones.length));
                ud.rotSpeed += 0.15 * (this.progressSpeed || 0) * (n / (0.5 * this.plantBones.length));
                ud.rotSpeed = 0.05 * -ud.rotOffset + 0.8 * ud.rotSpeed;
                ud.rotOffset += ud.rotSpeed;
                if (ud.rot) {
                  bone.rotation.x = ud.rot.x + ud.rotOffset;
                  bone.rotation.z = ud.rot.z - 0.4 * ud.rotOffset;
                }
              }
            }
          }
          this.preProgress = this.progress;
        };

        // Upewnij się, że ziarna kukurydzy nie istnieją
        potSection.cornKernels = [];

        console.log('[PrismController] Scena doniczki z Prism Stone, rosnącą rośliną i tłami pomyślnie zintegrowana.');
      }).catch(function(err) {
        console.warn('[PrismController] Błąd montażu sceny doniczki:', err);
      });
    },

    /**
     * Tuning parametrów na żywo w konsoli:
     * window.prismController.tune({ plantPosY: 2.5, desktopScale: 1.8 })
     */
    tune: function(newParams) {
      Object.assign(this.tuning, newParams);
      var pot = window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].pot;
      if (pot) {
        var isMobile = window.innerWidth < 768;
        if (pot.prismPivot) {
          var psc = isMobile ? this.tuning.mobileScale : this.tuning.desktopScale;
          pot.prismPivot.scale.set(psc, psc, psc);
        }
        if (pot.mainPlantObject) {
          pot.mainPlantObject.scale.set(this.tuning.plantScale, this.tuning.plantScale, this.tuning.plantScale);
          pot.mainPlantObject.position.set(this.tuning.plantPosX, this.tuning.plantPosY, this.tuning.plantPosZ);
        }
        if (pot.container) {
          pot.container.position.set(
            isMobile ? this.tuning.mobilePosX : this.tuning.desktopPosX,
            isMobile ? this.tuning.mobilePosY : this.tuning.desktopPosY,
            this.tuning.posZ
          );
        }
        if (pot.prismModel) {
          pot.prismModel.traverse(function(c) {
            if (c.isMesh && c.material) {
              c.material.emissiveIntensity = PrismController.tuning.emissiveIntensity;
            }
          });
        }
      }
      return this.tuning;
    }
  };

  window.prismController = PrismController;

  // Automatyczny nasłuch na moment zainicjowania silnika Three.js
  var checkInterval = setInterval(function() {
    var science = window.view && window.view.sections && window.view.sections[1];
    if (science && science.pot && science.pot.container) {
      clearInterval(checkInterval);
      PrismController.attachToSciencePot(science.pot);
    }
  }, 200);

  setTimeout(function() { clearInterval(checkInterval); }, 15000);
})();
