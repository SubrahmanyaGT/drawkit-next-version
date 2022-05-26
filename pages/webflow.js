export default function WebflowScript() {
  let myFunction = () => {
    console.log("click");
  };
  return (
    <script>
      document
        .getElementById("signup")
        .addEventListener("click", function () {
          console.log("runing function ")
        })
    </script>
  );
}
