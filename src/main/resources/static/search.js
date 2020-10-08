//TODO: error message if API not responding

document.addEventListener('DOMContentLoaded', function()
{
    //Check if logged in
    if(getCookie("username")){
        loggedin(getCookie("username"), getCookie("session"));
    }

    var sb = document.getElementById("searchbox");

    var debouncedSearch = _.debounce(function(){

        //Remove results of previous search
        document.getElementById("resultList").innerHTML="";

        //Hide "More Results" button
        document.getElementById("moreResults").style.display = "none";

        var page = 1;
        var returnedMovies=searchMovies(sb.value, page);

        var moreRes = document.getElementById("moreResults");
        moreRes.onclick=function(){
            searchMovies(sb.value, ++page);
        }

        //Show "More Results" button
        if(!(returnedMovies.length<11) && returnedMovies.length>0){
            moreRes.style.display = "block";
        }
        else {
            moreRes.style.display="none";
        }


    }, 3000);

    sb.addEventListener('input', debouncedSearch);

    //Log In button
    document.getElementById("signInBtn").addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        var userID = document.getElementById("signInUser").value;
        xhr.open('POST', 'http://localhost:8080/login');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            var response = JSON.parse(this.responseText);
            console.log("Response: " +response);
            if (xhr.status === 200 && response.userId == null) {
                alert('Something went wrong.');
            }
            else if (xhr.status !== 200) {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
            else if(xhr.status===200 && response.userId === userID){
                loggedin(response.userId, response.sessionId);
            }
            else{
                alert("Try again.");
            }
        };

        var toSend = {
            id: userID,
            password: document.getElementById("signInPass").value
        };
        var jsonString = JSON.stringify(toSend);
        console.log(toSend);

        xhr.send(jsonString);
    })

    //Register button
    document.getElementById("registerBtn").addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        var userID = document.getElementById("registerUser").value;
        xhr.open('POST', 'http://localhost:8080/register');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            var response = JSON.parse(this.responseText);
            console.log(response);
            if (xhr.status === 200 && response.userId == null) {
                alert('Something went wrong.');
            }
            else if (xhr.status !== 200) {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
            else if(xhr.status===200 && response.userId === userID){
                loggedin(response.userId, response.sessionId);
            }
            else{
                alert("Try again.");
            }
        };

        var toSend = {
            id: userID,
            password: document.getElementById("registerPass").value
        };
        var jsonString = JSON.stringify(toSend);
        console.log(toSend);

        xhr.send(jsonString);
    })
})


function searchMovies(term, page) {


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            console.log(response);

            var results = response.Search;

            //Request full info for each film
            if(results){
                for(let i =0; i<results.length; i++)
                {
                    getMovieDetails(results[i].imdbID);
                }


                //Show "More Results" button
                if(!(results.length<10)){
                    document.getElementById("moreResults").style.display = "block";
                }
                else{
                    document.getElementById("moreResults").style.display = "none";
                }

            }
            else{
                var sp = document.createElement("SPAN");
                var noResults = document.createTextNode("No films found.");
                document.getElementById("moreResults").style.display = "none";
                sp.appendChild(noResults);
                document.getElementById("resultList").appendChild(sp);
            }
        }
    };
    xhttp.open("GET", "http://www.omdbapi.com/?s=" + term + "&type=movie&page=" + page + "&apikey=b9bc86bc", true);
    xhttp.send();

    return results;
}

function getMovieDetails(ID){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            var fullInfo = JSON.parse(this.responseText);
            displayMovie(fullInfo);


        }
    };
    xhttp.open("GET", "http://www.omdbapi.com/?i=" + ID +"&type=movie&apikey=b9bc86bc", true);
    xhttp.send();



}

function displayMovie(movie) {
    console.log(movie);

    var movieDiv = document.createElement("DIV");
    movieDiv.className="movieDiv";

    //Header: Title & year
    var head = document.createElement("DIV");
    head.className="movieHeader";
    var title = document.createElement("H1");
    title.className="title";
    title.appendChild(document.createTextNode(movie.Title));

    var year = document.createElement("H3");
    year.className="year";
    year.appendChild(document.createTextNode(movie.Year));

    head.appendChild(title);
    head.appendChild(year);
    movieDiv.appendChild(head);

    //Info Div: Assorted movie information
    var infoDiv = document.createElement("DIV");
    infoDiv.className="infoDiv";

    //Display Poster
    var poster = document.createElement("IMG");
    poster.src=movie.Poster;
    poster.className="poster";
    infoDiv.appendChild(poster);

    //Paragraph with movie details
    var details = document.createElement("P");
    details.className="details";

    //Genre
    var boldGenre = document.createElement("B");
    boldGenre.innerHTML="Genre: ";
    var genre = document.createElement("P");
    genre.appendChild(boldGenre);
    genre.appendChild(document.createTextNode(movie.Genre));
    details.appendChild(genre);
    details.appendChild(document.createElement("BR"));



    //Plot
    var boldPlot = document.createElement("B");
    boldPlot.innerHTML="Plot: ";
    var plot = document.createElement("P");
    plot.className="plot";
    plot.appendChild(boldPlot);
    plot.appendChild(document.createTextNode(movie.Plot));

    details.appendChild(plot);
    details.appendChild(document.createElement("BR"));


    //IMDb Rating
    var boldRating = document.createElement("B");
    boldRating.innerHTML="IMDb Rating: ";
    var rating = document.createElement("P");
    rating.appendChild(boldRating);
    rating.appendChild(document.createTextNode(movie.imdbRating));
    details.appendChild(rating);
    details.appendChild(document.createElement("BR"));


    infoDiv.appendChild(details);

    //More plot button
    var more = document.createElement("BUTTON");
    more.className="moreInfoBtn";
    more.innerHTML="More...";
    more.onclick = function() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                var fullPlotMovie = JSON.parse(this.responseText);
                console.log(fullPlotMovie);
                //Replace plot text
                plot.innerHTML="";
                plot.className="plot";
                plot.appendChild(boldPlot);
                plot.appendChild(document.createTextNode(fullPlotMovie.Plot));

                //Hide button
                more.style.display = "none";
            }
        };
        xhr.open("GET", "http://www.omdbapi.com/?i=" + movie.imdbID +"&type=movie&plot=full&apikey=b9bc86bc", true);
        xhr.send();
    }

    //Save film button
    var saveBtn = document.createElement("BUTTON");
    saveBtn.className="saveBtn";
    saveBtn.innerHTML="Bookmark Film";
    saveBtn.addEventListener('click', function(){
        var xhr = new XMLHttpRequest();
        //Save button only works when logged in
        if(getCookie("username")){
            xhr.onreadystatechange = function() {
                var response = JSON.parse(this.responseText);
                console.log("Save response: "+ response);
                if(xhr.status===200 && response.imdbID==="exists"){
                    alert("This film is already in your bookmarks.");
                }
                else if (xhr.status===200 && response.imdbId === movie.imdbID){
                    alert("Saved successfully.");
                }
                else if (xhr.status !== 200) {
                    alert('Request failed.  Returned status of ' + xhr.status);
                }
                else{
                    alert("Something went wrong.");
                }
            }
            xhr.open('GET', 'http://localhost:8080/user/'+ getCookie("username") + '/bookmark/'+movie.imdbID );

            xhr.send();
        }
        else{
            alert("Please register or login to add bookmarks.");
        }

    })

    infoDiv.appendChild(more);
    infoDiv.appendChild(saveBtn);

    movieDiv.appendChild(infoDiv);


    var listEntry = document.createElement("LI");
    listEntry.appendChild(movieDiv);
    document.getElementById("resultList").appendChild(listEntry);
    document.getElementById("resultList").appendChild(document.createElement("HR"));

}


function loggedin(username, sessionID){
    document.cookie="username="+username;
    document.cookie="session="+sessionID;

    document.getElementById("notLoggedIn").style.display="none";

    //User info panel
    var loggedInDiv = document.getElementById("loggedInUser");

    var header = document.createElement("P");
    var text = document.createTextNode("You are logged in as "+ username);
    header.id="userHeader";
    header.appendChild(text);
    loggedInDiv.appendChild(header);

    //Log Out Button
    var logOutBtn = document.createElement("BUTTON");
    logOutBtn.id="logOutBtn";
    logOutBtn.innerHTML="Log Out";
    logOutBtn.addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/logout');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload=function(){
            if(xhr.status===200){
                document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                loggedInDiv.innerHTML="";
                document.getElementById("loggedInUser").style.display="none";
                document.getElementById("notLoggedIn").style.display="block";
                document.getElementById("resultList").innerHTML="";
            }
            else{
                alert('Something went wrong.');
            }
        }



        var toSend = {
            userId: getCookie("username"),
            sessionId: getCookie("session")
        };

        var jsonString = JSON.stringify(toSend);

        xhr.send(jsonString);

    })

    //User bookmark button
    var bookmarksBtn = document.createElement("BUTTON");
    bookmarksBtn.innerHTML="My Bookmarks";
    bookmarksBtn.addEventListener('click', function(){
        var xhr = new XMLHttpRequest();
        //Request and display bookmarked movies
        xhr.onreadystatechange=function(){
            if (this.readyState == 4 && this.status == 200){
                console.log(this.responseText);

                var resultList = document.getElementById("resultList");
                //Hide "More Results" button
                document.getElementById("moreResults").style.display = "none";

                resultList.innerHTML="";
                var bookHeader = document.createElement("H1");
                bookHeader.appendChild(document.createTextNode("Bookmarks"));
                bookHeader.id="bookHeader";
                resultList.appendChild(bookHeader);

                var response = JSON.parse(this.responseText);
                var bookmarked = response.movies;
                //console.log(bookmarked);
                if (bookmarked.length==0){
                    var noBookmarks = document.createElement("H3");
                    noBookmarks.id="noBookmarks";
                    noBookmarks.innerHTML="You don't have any bookmarks yet.";
                    resultList.appendChild(noBookmarks);
                }
                else{
                    for(let i =0; i<bookmarked.length; i++)
                    {
                        getMovieDetails(bookmarked[i].imdbId);
                    }
                }


            }
        }
        xhr.open('GET', 'http://localhost:8080/user/' + getCookie("username") +'/bookmarks');
        xhr.send();

    })

    loggedInDiv.appendChild(logOutBtn);
    loggedInDiv.appendChild(bookmarksBtn);

    loggedInDiv.style.display="block";

}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}