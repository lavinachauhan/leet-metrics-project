document.addEventListener("DOMContentLoaded", function(){

    const searchButton = document.getElementById("search");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy");
    const mediumProgressCircle = document.querySelector(".medium");
    const hardProgressCircle = document.querySelector(".hard");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");

    function validateUserName(username){
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }
        const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
        const isMatching = usernameRegex.test(username);
        if(!isMatching){
            alert("Invalid username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username){
        
        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            // statsContainer.style.setProperty("display", none);
    
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = 'https://leetcode.com/graphql/';

            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

           const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyUrl + targetUrl, requestOptions);
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }
            const parsedData = await response.json();
            console.log("Loggind data: ", parsedData);

            displayUserData(parsedData);
        }
        catch(error){
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }

    }

    function updateProgress(solved, total, label, circle){
        const progressDegress = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegress}%`)
        label.textContent = `${solved}/${total}`;

    }


    function displayUserData(parsedData){
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumsQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumsQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle); 

        const cardsData = [
            {label: "Overall Submissions", 
            value : parsedData.data.matchedUser.submitStats.
            totalSubmissionNum[0].submissions},

            {label: "Overall Easy Submissions", 
            value : parsedData.data.matchedUser.submitStats.
            totalSubmissionNum[1].submissions},

            {label: "Overall Medium Submissions", 
            value : parsedData.data.matchedUser.submitStats.
            totalSubmissionNum[2].submissions},

            {label: "Overall Hard Submissions", 
            value : parsedData.data.matchedUser.submitStats.
            totalSubmissionNum[3].submissions},
        ];

        cardStatsContainer.innerHTML = cardsData.map(

            data =>
                `<div class = "card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
                </div>`
        ).join("")
    }


    searchButton.addEventListener('click', function(){
        const username =  usernameInput.value;
        //username enter ho gya ab pehla task h ki username valid h ya nhi
        console.log("logging username: ", username);
        if(validateUserName(username)){
            fetchUserDetails(username);
        }
    });
});