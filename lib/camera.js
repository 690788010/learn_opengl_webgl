

// Default camera values
const YAW         = -90.0;
const PITCH       =  0.0;
const SPEED       =  2.5;
const SENSITIVITY =  0.1;
const ZOOM        =  45.0;
// An abstract camera class that processes input and calculates the corresponding Euler Angles, Vectors and Matrices for use in WebGL
class Camera {
  constructor(position = [0.0, 0.0, 0.0], up = [0.0, 1.0, 0.0], yaw = YAW, pitch = PITCH) {
    // camera Attributes
    this.Position = position;
    this.Front = [0.0, 0.0, -1.0];
    this.WorldUp = up;
    this.Up;
    this.Right;

    // euler Angles
    this.Yaw = yaw;
    this.Pitch = pitch;
    
    // camera options
    this.MovementSpeed = SPEED;
    this.MouseSensitivity = SENSITIVITY;
    this.Zoom = ZOOM;

    this._updateCameraVectors();
  }

  // returns the view matrix calculated using Euler Angles and the LookAt Matrix
  GetViewMatrix() {
    return lookAt(this.Position, add(this.Position, this.Front), this.Up);
  }

  // processes input received from any keyboard-like input system. Accepts input parameter in the form of camera defined ENUM (to abstract it from windowing systems)
  ProcessKeyboard(direction, deltaTime) {
    const velocity = this.MovementSpeed * deltaTime;
    if (direction === "FORWARD") {
      this.Position = add(this.Position, scale(velocity, this.Front));
    } else if (direction === "BACKWARD") {
      this.Position = subtract(this.Position, scale(velocity, this.Front));
    } else if (direction === "LEFT") {
      this.Position = subtract(this.Position, scale(velocity, this.Right));
    } else if (direction == "RIGHT") {
      this.Position = add(this.Position, scale(velocity, this.Right));
    }
  }

  // processes input received from a mouse input system. Expects the offset value in both the x and y direction.
  ProcessMouseMovement(xoffset, yoffset, constrainPitch = true) {
      xoffset *= this.MouseSensitivity;
      yoffset *= this.MouseSensitivity;

      this.Yaw   += xoffset;
      this.Pitch += yoffset;

      // make sure that when pitch is out of bounds, screen doesn't get flipped
      if (constrainPitch) {
        if (this.Pitch > 89.0) {
          this.Pitch = 89.0;
        }
        if (this.Pitch < -89.0) {
          this.Pitch = -89.0;
        }
      }

      // update Front, Right and Up Vectors using the updated Euler angles
      this._updateCameraVectors();
  }

  // processes input received from a mouse scroll-wheel event. Only requires input on the vertical wheel-axis
  ProcessMouseScroll(yoffset) {
    this.Zoom -= yoffset;
    if (this.Zoom < 1.0) {
      this.Zoom = 1.0;
    }
    if (this.Zoom > 45.0) {
      this.Zoom = 45.0; 
    }
  }

  // calculates the front vector from the Camera's (updated) Euler Angles
  _updateCameraVectors() {
      // calculate the new Front vector
      const front = [];
      front[0] = Math.cos(radians(this.Yaw)) * Math.cos(radians(this.Pitch));
      front[1] = Math.sin(radians(this.Pitch));
      front[2] = Math.sin(radians(this.Yaw)) * Math.cos(radians(this.Pitch));
      this.Front = normalize(front);
      // also re-calculate the Right and Up vector
      this.Right = normalize(cross(this.Front, this.WorldUp));  // normalize the vectors, because their length gets closer to 0 the more you look up or down which results in slower movement.
      this.Up    = normalize(cross(this.Right, this.Front));
  }
}
