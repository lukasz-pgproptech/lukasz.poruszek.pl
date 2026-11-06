/**
 * prism-controller.js
 * Moduł do czystego, modularnego zarządzania modelem Prism Stone (bez grzebania w minifikacji).
 * Dostarcza oryginalny model PBR ze Sketchfaba, poprawne oświetlenie na Warstwie 5 i API do tuningu w locie.
 */
(function() {
  const PrismController = {
    modelUrl: '/models/prism/scene.gltf',
    loadedGltf: null,

    // Parametry tuningu (dostępne z konsoli przeglądarki przez window.prismController.tuning)
    tuning: {
      desktopScale: 1.45,
      mobileScale: 0.95,
      desktopPosX: 1.15,
      mobilePosX: 0.0,
      desktopPosY: 0.0,
      mobilePosY: -0.8,
      posZ: 3.0,
      emissiveIntensity: 1.1,
      lightIntensity: 1.3,
      rotSpeedY: 0.007,
      rotSpeedX: 0.002
    },

    loadModel: function() {
      if (this.loadedGltf) return Promise.resolve(this.loadedGltf);
      return new Promise(function(resolve, reject) {
        if (!window.THREE || !window.THREE.GLTFLoader) {
          return reject(new Error('THREE.GLTFLoader not available yet'));
        }
        var loader = new window.THREE.GLTFLoader();
        loader.load(PrismController.modelUrl, function(gltf) {
          PrismController.loadedGltf = gltf;
          resolve(gltf);
        }, undefined, reject);
      });
    },

    /**
     * Wstrzykuje i konfiguruje Prism Stone w sekcji Science (dawna doniczka)
     */
    attachToSciencePot: function(potSection) {
      if (!potSection || !potSection.container) return;

      this.loadModel().then(function(gltf) {
        // Oczyszczenie kontenera ze starych obiektów
        while (potSection.container.children.length > 0) {
          potSection.container.remove(potSection.container.children[0]);
        }

        var isMobile = window.innerWidth < 768;
        var t = PrismController.tuning;

        // Ustaw pozycję kontenera
        potSection.container.position.set(
          isMobile ? t.mobilePosX : t.desktopPosX,
          isMobile ? t.mobilePosY : t.desktopPosY,
          t.posZ
        );

        // Klonuj model
        var model = gltf.scene.clone(true);

        // Skonfiguruj warstwę 5 i materiały PBR
        model.traverse(function(child) {
          if (child.isMesh) {
            child.layers.set(5);
            if (child.material) {
              child.material = child.material.clone();
              child.material.side = window.THREE.DoubleSide;
              child.material.emissiveIntensity = t.emissiveIntensity;
              child.material.roughness = 0.45;
              child.material.metalness = 0.35;
            }
          }
        });

        // Opakuj w pivot centrujący (środek modelu w scene.gltf to Y ~ 0.73)
        var pivot = new window.THREE.Group();
        pivot.add(model);
        model.position.set(0, -0.73, 0);

        var sc = isMobile ? t.mobileScale : t.desktopScale;
        pivot.scale.set(sc, sc, sc);

        potSection.container.add(pivot);
        potSection.mainPotObject = pivot;
        potSection.prismPivot = pivot;
        potSection.prismModel = model;

        // Dodaj oświetlenie warstwy 5 do sceneWrapper (jeśli jeszcze nie ma)
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

        console.log('[PrismController] Prism Stone successfully attached to Science Scene 3');
      }).catch(function(err) {
        console.warn('[PrismController] Error attaching Prism Stone:', err);
      });
    },

    /**
     * Umożliwia natychmiastowy tuning w konsoli przeglądarki:
     * window.prismController.tune({ desktopScale: 1.6, emissiveIntensity: 1.5 })
     */
    tune: function(newParams) {
      Object.assign(this.tuning, newParams);
      var pot = window.view && window.view.sections && window.view.sections[1] && window.view.sections[1].pot;
      if (pot && pot.prismPivot) {
        var isMobile = window.innerWidth < 768;
        var sc = isMobile ? this.tuning.mobileScale : this.tuning.desktopScale;
        pot.prismPivot.scale.set(sc, sc, sc);
        pot.container.position.set(
          isMobile ? this.tuning.mobilePosX : this.tuning.desktopPosX,
          isMobile ? this.tuning.mobilePosY : this.tuning.desktopPosY,
          this.tuning.posZ
        );
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

  // Bezpiecznik: anuluj sprawdzanie po 15 sekundach
  setTimeout(function() { clearInterval(checkInterval); }, 15000);
})();
