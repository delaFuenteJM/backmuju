document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const logoutButton = document.getElementById("logout-button");

  async function submitForm(e, endpoint, redirectUrl) {
    e.preventDefault();

    const data = new FormData(e.target);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.status === "success") {
      setTimeout(() => {
        window.location.replace(redirectUrl);
      }, 500);
    } else {
      alert(result.message || "Ocurrió un error.");
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) =>
      submitForm(e, "/api/sessions/login", "/")
    );
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) =>
      submitForm(e, "/api/sessions/register", "/login")
    );
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        const response = await fetch("/api/sessions/logout", {
          method: "POST",
        });

        const result = await response.json();

        if (result.status === "success") {
          window.location.replace("/login");
        } else {
          alert(result.message || "Error al cerrar sesión.");
        }
      } catch (error) {
        console.error("Error durante el logout:", error);
        alert("Error de red al cerrar sesión.");
      }
    });
  }
});
