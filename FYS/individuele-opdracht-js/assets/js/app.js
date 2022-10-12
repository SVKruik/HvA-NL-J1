function myFunction() {
    console.log("Hello world!");
    document.querySelector(".button-text").innerHTML = "Hello world!";

    const img = document.createElement("img");
    img.src = "./../img/Carbon.png";
    var src = document.querySelector(".button-text")
    src.appendChild(img);
}
