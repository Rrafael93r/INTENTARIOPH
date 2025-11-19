import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../servicios/authServices';
import logoph from "../../assets/inner.png";
import sistemas from "../../assets/SISTEMA_DE_GESTION_TIC_enhanced.webp";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await login(username, password); // Llamada a la función login del servicio authServices
      if (user && user.role) {
        Swal.fire({
          icon: 'success',
          title: 'Login exitoso',
          text: `Bienvenido, ${user.username || 'Usuario'}!`,
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(user.role.id === 1 ? '/proveedores' : '/reportes');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error en la estructura del usuario.',
        });
      }
    } catch (err) {
      console.error('Error durante el login:', err);
      Swal.fire({
        icon: 'error',
        title: 'Usuario o contraseña incorrectos',
        text: 'Por favor, verifica tus credenciales.',
      });
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="card shadow-lg">
              <div className="row g-0">
                <div className="col-lg-6 p-5">
                  <div className="d-lg-none text-center mb-4">
                    <img src={logoph} alt="Logo" className="img-fluid" style={{ maxWidth: '100px' }} />
                  </div>
                  <div className="d-none d-lg-block position-absolute top-50 start-50 translate-middle">
                    <div className="bg-white p-3 rounded-circle shadow">
                      <img src={logoph} alt="Logo" className="img-fluid" style={{ width: '50px' }} />
                    </div>
                  </div>
                  <h2 className="fw-bold mb-4">Iniciar Sesión</h2>
                  <h4 className="h6 fw-bold mb-2">Accede a tu cuenta</h4>
                  <p className="text-muted small mb-4">
                    Bienvenido de vuelta a <strong>nuestro sistema</strong>
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn  btn-lg w-100" style={{ backgroundColor: '#f6952c', color: '#fff' }}>
                      Iniciar Sesión
                    </button>
                  </form>

                  <div className="position-relative my-4">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">
                      o
                    </span>
                  </div>

                  <p className="text-center text-muted small">
                    Copyright © 2024 Todos los derechos reservados
                  </p>
                </div>
                <div className="col-lg-6 bg-light">
                  <div className="h-100 d-flex align-items-center justify-content-center">
                    <img src={sistemas} className="img-fluid" alt="Sistema" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;