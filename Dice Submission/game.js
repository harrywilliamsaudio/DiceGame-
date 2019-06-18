// The approach to this project was informed by the following resources:
// Codecademy - Introduction to javascript
// W3C Schools - Javascript
// Website styling inspired by Codecademy CSS lessons & Kyle Schaefer.com

var noOfDice = 0;
var dice = [];
var totalPoints = 0;
var noOfRoundsPlayed = 0;
var roundPoints = 0;
var setupWithoutError = false;

//Reads the player's input and assigns them to variable for the game logic to use
function setup()
{

    if (setupWithoutError)
    {
        alert("You must end the current game before setting up again!");
        return;
    }

    var inputNumber = document.getElementById('diceInput').value;

    // Checks that the input is a number
    if (isNaN(inputNumber))
    {
        alert("Please enter a number between 3 and 6!");
        document.getElementById('diceInput').value = "";
        document.getElementById('diceInput').focus();
        setupWithoutError = false;
    }

    // Checks that the number is in range
    else if (inputNumber < 3 || inputNumber > 6)
    {
        alert("Number of dice should be between 3 and 6. Please try again!");
        document.getElementById('diceInput').value = "";
        document.getElementById('diceInput').focus();
        setupWithoutError = false;
    }

    // Creates the requisite number of dice if there are no input errors.
    else
    {
        initDisplay();
        noOfDice = inputNumber;
        setupWithoutError = true;
        showDice();
        document.getElementById('diceInput').disabled = true;
    }
}

// The function triggered by the play button
function play()
{
    if (setupWithoutError)
    {
        noOfRoundsPlayed++;
        roundPoints = 0;
        rollDice();
        calculateRoundPoints();
        totalPoints += roundPoints;
        displayResults();
    }

    else
    {
        alert("Please enter the number of dice before and press setup before you play!")
    }
}

// Ends the game, resets the global variables & displays results.
function end()
{
    if (setupWithoutError === true)
    {
        initDiceDisplay();
        displayEndResults();
        setupWithoutError = false;
        totalPoints = 0;
        noOfRoundsPlayed = 0;
    }

    else
    {
        alert("Setup the game and play!")
    }
}

// Displays the requisite amount of dice.
function showDice()
{
    for (var i = 1; i <= noOfDice; i++)
    {
        var diceId = "dice" + i;
        document.getElementById(diceId).setAttribute("style", "display:inline-block");
    }
}

// Initialises the display
function initDisplay()
{
    initDiceDisplay();
    document.getElementById("results").innerHTML = "";
}

// Resets the dice display
function initDiceDisplay()
{
    for (var i = 1; i <= 6; i++)
    {
        var diceId = "dice" + i;
        document.getElementById(diceId).setAttribute("style", "display:none");
        document.getElementById(diceId).innerText = "";
    }
}

// Calculates and prints the round results
function displayResults()
{
    var roundDisplay = "Number of rounds played : " + noOfRoundsPlayed + "<br>";
    var roundPointDisplay = "Points for this round : " + roundPoints + "<br>";
    var totalPointDisplay = "Total points : " + totalPoints + "<br>";
    document.getElementById('results').innerHTML = roundDisplay + roundPointDisplay + totalPointDisplay;

    //Changes the 'play' button to read 'play again'
    document.getElementById('play').innerText = "PLAY AGAIN";
    document.getElementById('play').setAttribute("style", "width:200px");
}

// Calculates and prints the final end result
function displayEndResults()
{

    var totalPointDisplay = "Total points : " + totalPoints + "<br>";
    var roundDisplay = "Number of rounds played : " + noOfRoundsPlayed + "<br>";
    var averagePointDisplay = "Point average : " + getAveragePoints() + "<br>";
    document.getElementById('results').innerHTML = totalPointDisplay + roundDisplay + averagePointDisplay;

    // Resets all the display attributes
    document.getElementById('diceInput').disabled = false;
    document.getElementById('diceInput').value = "";
    document.getElementById('play').innerText = "PLAY";
    document.getElementById('play').setAttribute("style", "width:100px");
}

// Calculates the average value
function getAveragePoints()
{
    var averagePoints;
    if (noOfRoundsPlayed !== 0)
    {
        averagePoints = totalPoints / noOfRoundsPlayed;
    }

    else
        averagePoints = 0;

        // Rounding to set average to 2 decimal places.
    return Math.round(averagePoints * 100) / 100;
}

// Automatically focuses the input into the dice box when the page loads.
function onLoad()
{
    document.getElementById('diceInput').focus();
}

// Generates the randomised value for each dice in turn
function rollDice()
{
    dice = [];
    for (var i = 0; i < noOfDice; i++)
    {
        dice.push(generateDiceSide()); //assign random value to each dice
        var diceNumber = i + 1;
        var diceId = "dice" + diceNumber;
        document.getElementById(diceId).innerText = dice[i]; //display the dice value in each dice
    }
}

// Assigns the points based on the data set
function calculateRoundPoints()
{
    if (allDiceHasSameValue())
    {
        roundPoints = 60 + getSumOfAllValues();
        return;
    }

    if (allExceptOneHasSameValue())
    {
        roundPoints = 40 + getSumOfAllValues();
        return;
    }

    if (isARun())
    {
        roundPoints = 20 + getSumOfAllValues();
        return;
    }

    if (allDifferent())
    {
        roundPoints = getSumOfAllValues();
    }
}

// Returns a number between 1 and 6
function generateDiceSide()
{
    return Math.floor((Math.random() * 6) + 1);
}

// Breaks the loop when a mismatch is found.
function allDiceHasSameValue()
{
    var comparator = dice[0];
    for (var i = 1; i < dice.length; i++)
    {
        if (comparator !== dice[i])
        {
            return false;
        }
    }
    return true;
}

// LOGIC - If the duplicate count is the same as (array length - 2).
function allExceptOneHasSameValue()
{
    return countDuplicates() === dice.length - 2;
}

// LOGIC - A run should have no duplicates, and the difference between min & max is one less than the dice count.
function isARun()
{
    var max = Math.max.apply(null, dice);
    var min = Math.min.apply(null, dice);

    return max - min === dice.length - 1 && countDuplicates() === 0;
}

// LOGIC - If there are 0 duplicates, each value must be unique.
function allDifferent()
{
    return countDuplicates() === 0;
}

// Iterates the dice array and sorts the values into another array.
function countDuplicates()
{
    var uniqueItems = new Set();
    var duplicates = [];
    for (var i = 0; i < dice.length; i++)
    {
        var value = dice[i];
        if (uniqueItems.has(value))
        {
            duplicates.push(value);
        }
        else
        {
            uniqueItems.add(value);
        }
    }
    return duplicates.length;
}

// Returns the sum of all the dice values
function getSumOfAllValues()
{
    var sum = 0;
    for (var i = 0; i < dice.length; i++)
    {
        sum += dice[i];
    }
    return sum;
}

// A test function to ensure game logic is correct.

// function gameLogicTest()
// {
//     testDice([3, 3, 3, 3]);
//     testDice([4, 4, 4, 6]);
//     testDice([2, 5, 2, 2]);
//     testDice([3, 4, 5, 6]);
//     testDice([4, 3, 2, 1]);
//     testDice([4, 6, 3, 5]);
//     testDice([4, 5, 3, 1]);
//     testDice([3, 6, 2, 5]);
//     testDice([4, 5, 3, 3]);
// }

// Generates the dice for the test function.
// function testDice(diceVal)
// {
//     noOfDice = 4;
//     dice = [];
//     roundPoints = 0;
//     dice = diceVal;
//     calculateRoundPoints();
//     console.log("Dice:", dice, "Round Points:", roundPoints);
// }
