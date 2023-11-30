// Importamos los componentes necesarios
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// Creamos un componente funcional llamado App
function App() {
  // Definimos el estado inicial de la aplicación
  const [users, setUsers] = useState([]); // Un array vacío para almacenar los usuarios
  const [query, setQuery] = useState(""); // Una cadena vacía para guardar la consulta de búsqueda
  const [loading, setLoading] = useState(false); // Un valor booleano para indicar si se está cargando la petición
  const [error, setError] = useState(null); // Un valor nulo para guardar el posible error de la petición

  // Definimos un efecto que se ejecuta cuando cambia la consulta de búsqueda
  useEffect(() => {
    // Creamos una función asíncrona para hacer la petición a la API de GitHub
    const fetchUsers = async () => {
      // Si la consulta está vacía, no hacemos nada
      if (query === "") return;
      // Si no, ponemos el estado de carga a verdadero y el de error a nulo
      setLoading(true);
      setError(null);
      try {
        // Hacemos la petición con axios y guardamos la respuesta
        const response = await axios.get(
          `https://api.github.com/search/users?q=${query}`
        );
        // Extraemos el array de usuarios de la respuesta
        const users = response.data.items;
        // Actualizamos el estado de usuarios con el array obtenido
        setUsers(users);
      } catch (error) {
        // Si hay algún error, lo guardamos en el estado de error
        setError(error.message);
      }
      // Ponemos el estado de carga a falso
      setLoading(false);
    };
    // Invocamos la función asíncrona
    fetchUsers();
    // Guardamos la consulta de búsqueda en el localStorage
    localStorage.setItem("query", query);
  }, [query]); // El efecto depende del estado de la consulta

  // Definimos un efecto que se ejecuta cuando se monta el componente
  useEffect(() => {
    // Obtenemos la consulta de búsqueda del localStorage
    const query = localStorage.getItem("query");
    // Si hay alguna, la guardamos en el estado de la consulta
    if (query) {
      setQuery(query);
    }
  }, []); // El efecto no tiene dependencias

  // Definimos una función para manejar el cambio del input de búsqueda
  const handleChange = (e) => {
    // Obtenemos el valor del input
    const value = e.target.value;
    // Lo guardamos en el estado de la consulta
    setQuery(value);
  };

  // Definimos una función para renderizar la lista de usuarios
  const renderUsers = () => {
    // Si hay algún error, mostramos un mensaje
    if (error) {
      return <p className="error">Ha ocurrido un error: {error}</p>;
    }
    // Si se está cargando, mostramos un indicador
    if (loading) {
      return <p className="loading">Cargando...</p>;
    }
    // Si no hay usuarios, mostramos un mensaje
    if (users.length === 0) {
      return <p className="empty">No se han encontrado usuarios</p>;
    }
    // Si hay usuarios, los mostramos en una lista
    return (
      <ul className="users">
        {users.map((user) => (
          <li key={user.id} className="user">
            <img src={user.avatar_url} alt={user.login} className="user-image" />
            <a href={user.html_url} target="_blank" className="user-link">
              {user.login}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  // Retornamos el JSX de la aplicación
  return (
    <div className="app">
      <h1 className="title">Buscar usuarios en GitHub</h1>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Introduce un nombre de usuario"
        className="input"
      />
      {renderUsers()}
    </div>
  );
}

// Exportamos el componente App
export default App;
