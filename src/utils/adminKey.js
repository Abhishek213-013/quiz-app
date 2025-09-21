import router from '../router'  // import router to navigate

export function askSecretKey() {
  const key = prompt("Enter Admin Key:")
  if (key === "abhishek_30" || key === "Abhishek_30") {
    sessionStorage.setItem('isAdmin', 'true')  // temporary session
    router.push('/manage')  // navigate to manage page
  } else {
    alert("Incorrect key!")
  }
}
