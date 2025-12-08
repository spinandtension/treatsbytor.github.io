function sendMail(){
    var params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
        phone: document.getElementById("phone").value
    
    }
    const serviceID = "service_vziw9qr"
    const templateID = "template_0lfmwhl"

    emailjs.send(serviceID,templateID, params)
    .then((res)=>{
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value= "";
            document.getElementById("phone").value= "";
            console.log(rs);
            alert("your message sent successfully");
        })
    .catch((err) => console.log(err));
}