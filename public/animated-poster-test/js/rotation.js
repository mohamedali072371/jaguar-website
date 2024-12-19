AFRAME.registerComponent('interactive-rotation', {
    schema: {
      speed: { type: 'number', default: 1 } // Speed multiplier for rotation
    },
  
    init: function () {
      this.isDragging = false;
      this.previousPosition = { x: 0, y: 0 };
      this.currentRotation = this.el.object3D.rotation;
  
      // Bind event handlers
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
  
      // Add event listeners
      this.el.sceneEl.addEventListener('mousedown', this.handleMouseDown);
      this.el.sceneEl.addEventListener('mousemove', this.handleMouseMove);
      this.el.sceneEl.addEventListener('mouseup', this.handleMouseUp);
  
      // Touch support
      this.el.sceneEl.addEventListener('touchstart', this.handleMouseDown);
      this.el.sceneEl.addEventListener('touchmove', this.handleMouseMove);
      this.el.sceneEl.addEventListener('touchend', this.handleMouseUp);
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
    },
  
    handleMouseUp: function () {
      this.isDragging = false;
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
    }
  });