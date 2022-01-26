

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
    this.WorldUp = up;
    // euler Angles
    this.Yaw = yaw;
    this.Pitch = pitch;

    // camera Attributes
    this.Front = [0.0, 0.0, -1.0];
    this.Up;
    this.Right;
    
    // camera options
    this.MovementSpeed = SPEED;
    this.MouseSensitivity;
    this.Zoom;

    this._updateCameraVectors();
  }

  // returns the view matrix calculated using Euler Angles and the LookAt Matrix
  GetViewMatrix() {
      return lookAt(this.Position, add(this.Position + this.Front), this.Up);
  }

  // processes input received from any keyboard-like input system. Accepts input parameter in the form of camera defined ENUM (to abstract it from windowing systems)
  ProcessKeyboard(direction, deltaTime) {
    const velocity = this.MovementSpeed * deltaTime;
    if (direction === "FORWARD") {
      this.Position += this.Front * velocity;
    } else if (direction === "BACKWARD") {
      this.Position -= this.Front * velocity;
    } else if (direction === "LEFT") {
      this.Position -= this.Right * velocity;
    } else if (direction == "RIGHT") {
      this.Position += this.Right * velocity;
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
