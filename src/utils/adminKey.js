import router from '../router'  // import router to navigate

export function askSecretKey() {
  const key = prompt("Enter Admin Key:")
  if (key === "admin123" || key === "Admin123") {
    sessionStorage.setItem('isAdmin', 'true')  // temporary session
    router.push('/manage')  // navigate to manage page
  } else {
    alert("Incorrect key!")
  }
}
