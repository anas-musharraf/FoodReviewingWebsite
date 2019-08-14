const emails = []
//The array of hash tables are for all the users would be stored in the server and pulled into this file when used

class User {
    constructor(email, password, username, phonenumber, location, aboutme, role, name) {
        this.email = email
        this.passWord = password
        this.userID = username
        this.phoneNum = phonenumber
        this.location = location
        this.aboutMe = aboutme
        this.role = role
        this.name = name
    }
}

function getAllUsers() {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            users = JSON.parse(this.responseText);
            for(let i = 0; i < users.length; i++) {
                emails.push(users[i].email)
            }
        }
      };
    xhttp.open("GET",'/signup/users', true)
    xhttp.send()
}

var users = getAllUsers()

function showRest() {
    var email = document.getElementById("email").value
    var pass = document.getElementById("pwd").value
    var passConfirmed = document.getElementById("pwdConfirmed").value

    if(email.length == 0) {
        alert("Email Field Cannot Be Empty.")
    } else if (pass.length <= 5) {
        alert("Password Needs to be at least 6 characters long.")
    } else if (email.indexOf("@")==-1 || email.indexOf("@")==0) {
    	alert("Email must contain an @ symbol")
    } else if(emails.includes(email)) {
        alert("Email already in use.")
    } else if (pass.localeCompare(passConfirmed) != 0) {
        alert("Passwords do not match.")
    } else if ((pass.localeCompare(passConfirmed) == 0) && (!emails.includes(email))){
        var hiddenClass = document.getElementById("hiddenTable")
        var initSubmit = document.getElementById("initialSubmit")
        initSubmit.style.display = "none"
        hiddenClass.style.display = "block"
        document.getElementById("email").readOnly = true
        document.getElementById("pwd").readOnly = true
        document.getElementById("pwdConfirmed").readOnly = true
    }
}

function newEntry() {
    var email = document.getElementById("email").value
    var pass = document.getElementById("pwd").value
    var user = document.getElementById("userName").value
    var phNumb = document.getElementById("phoneNumber").value
    var Loc = document.getElementById("location").value
    var AboutMe = document.getElementById("aboutMe").value
    var Name = document.getElementById("Name").value

    if(Name.length == 0) {
        alert("Please enter your name.")
    } else if (phNumb.length != 10) {
        alert("Please enter a valid phone number.")
    } else if (user.length < 6) {
        alert("The username has to be at least 6 characters long.")
    } else if (Loc.length <= 5) {
        alert("Please enter a valid Canadian postal code")
    } else if (AboutMe.length != 0){
        document.getElementById("email").readOnly = true
        document.getElementById("pwd").readOnly = true
        document.getElementById("userName").readOnly = true
        document.getElementById("phoneNumber").readOnly = true
        document.getElementById("location").readOnly = true
        document.getElementById("aboutMe").readOnly = true
        document.getElementById("Name").readOnly = true
        postReq(new User(email,pass,user,phNumb,Loc,AboutMe, "User", Name))
        //users.push(new User(email,pass,user,phNumb,Loc,AboutMe, "User"))
        alert("Your Account Has Been Created! You May Log In Now.")
        window.location.href = "/login"
    } else {
        alert("All Fields Need To Be Filled")
    }
}

function postReq(userObj) {
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST",'/signup', true)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify({"name":userObj.name,"userID":userObj.userID,"location":userObj.location,"phoneNum":userObj.phoneNum,"email":userObj.email,"password":userObj.passWord,"aboutMe":userObj.aboutMe,"role":userObj.role}))
}

function search() {
    window.location.href = "/login"
    //document.getElementById("searchButton").click()
}
