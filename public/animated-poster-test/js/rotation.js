AFRAME.registerComponent('interactive-rotation', {
    schema: {
      speed: { type: 'number', default: 1 }, // Speed multiplier for rotation
      scaleSpeed: { type: 'number', default: 1 }, // Speed multiplier for scaling
      minScale: { type: 'number', default: 0.1 },   // Minimum zoom level
      maxScale: { type: 'number', default: 1.0 }  // Maximum zoom level
    },
  
    init: function () {
      this.isDragging = false;
      this.previousPosition = { x: 0, y: 0 };
      this.currentRotation = this.el.object3D.rotation;
      this.initialScale = this.el.object3D.scale.clone();
  
      // Bind event handlers
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);

      this.handleWheel = this.handleWheel.bind(this);
      this.handleTouchMove = this.handleTouchMove.bind(this);
  
      // Add event listeners
      this.el.sceneEl.addEventListener('mousedown', this.handleMouseDown);
      this.el.sceneEl.addEventListener('mousemove', this.handleMouseMove);
      this.el.sceneEl.addEventListener('mouseup', this.handleMouseUp);

        // Add event listeners for scaling
        this.el.sceneEl.addEventListener('wheel', this.handleWheel);
        this.el.sceneEl.addEventListener('touchmove', this.handleTouchMove);
  
      // Touch support
      this.el.sceneEl.addEventListener('touchstart', this.handleMouseDown);
      this.el.sceneEl.addEventListener('touchmove', this.handleMouseMove);
      this.el.sceneEl.addEventListener('touchend', this.handleMouseUp);

       // Variables for pinch zoom
    this.previousDistance = null;
    },
  
    handleMouseDown: function (event) {
      this.isDragging = true;
  
      // Record initial position (support touch or mouse)
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      this.previousPosition = { x: clientX, y: clientY };
    },
  
    handleMouseMove: function (event) {
      if (!this.isDragging) return;
      if (event.touches.length === 1) {
        // Get current position (support touch or mouse)
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    
        // Calculate rotation delta
        const deltaX = clientX - this.previousPosition.x;
        const deltaY = clientY - this.previousPosition.y;
    
        // Update rotation
        this.currentRotation.y += deltaX * this.data.speed * 0.01;
        this.currentRotation.x += deltaY * this.data.speed * 0.01;
    
        // Apply rotation
        this.el.object3D.rotation.set(
            this.currentRotation.x,
            this.currentRotation.y,
            this.currentRotation.z
        );
    
        // Update previous position
        this.previousPosition = { x: clientX, y: clientY };
      }
      
    },
  
    handleMouseUp: function () {
      this.isDragging = false;
      this.previousDistance = null;
    },

    handleWheel: function (event) {
        const scaleChange = event.deltaY > 0 ? -this.data.scaleSpeed : this.data.scaleSpeed;
        const newScale = this.el.object3D.scale.clone().addScalar(scaleChange);

        // Prevent negative or zero scaling
        newScale.set(
            Math.min(this.data.maxScale, Math.max(this.data.minScale, newScale.x)),
            Math.min(this.data.maxScale, Math.max(this.data.minScale, newScale.y)),
            Math.min(this.data.maxScale, Math.max(this.data.minScale, newScale.z))
          );

        this.el.object3D.scale.set(newScale.x, newScale.y, newScale.z);
    },

    handleTouchMove: function (event) {
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
        
            const currentDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
        
            if (this.previousDistance) {
                const scaleFactor = 1 + (currentDistance - this.previousDistance) * this.data.scaleSpeed * 0.001;
                const newScale = this.el.object3D.scale.clone().multiplyScalar(scaleFactor);
        
                
                // Prevent negative or zero scaling
                newScale.set(
                    Math.min(this.data.maxScale, Math.max(this.data.minScale, newScale.x)),
                    Math.min(this.data.maxScale, Math.max(this.data.minScale, newScale.y)),
                    Math.min(this.data.maxScale, Math.max(this.data.minScale, newScale.z))
                  );
        
                this.el.object3D.scale.set(newScale.x, newScale.y, newScale.z);
            }
        
            this.previousDistance = currentDistance;
        }
    },
  
    remove: function () {
      console.log('Remove')
      // Clean up event listeners
      this.el.sceneEl.removeEventListener('mousedown', this.handleMouseDown);
      this.el.sceneEl.removeEventListener('mousemove', this.handleMouseMove);
      this.el.sceneEl.removeEventListener('mouseup', this.handleMouseUp);
      this.el.sceneEl.removeEventListener('touchstart', this.handleMouseDown);
      this.el.sceneEl.removeEventListener('touchmove', this.handleMouseMove);
      this.el.sceneEl.removeEventListener('touchend', this.handleMouseUp);

      this.el.sceneEl.removeEventListener('wheel', this.handleWheel);
      this.el.sceneEl.removeEventListener('touchmove', this.handleTouchMove);
    }
  });