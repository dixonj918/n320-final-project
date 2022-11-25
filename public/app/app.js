RECIPES = [
  {
    name: "Supreme Pizza",
    desc: "Make pizza night super duper out of this world with homemade pizza. This recipe is supreme with vegetables and two types of meat. Yum!",
    time: "1h24mins",
    servings: 4,
    image: "recipe-pizza.jpg",
    ingredients: [
      {
        name: "1/4 batch pizza dough",
      },
      {
        name: "2 tablespoons Last-Minute Pizza Sauce",
      },
      {
        name: "10 slices pepperoni",
      },
      {
        name: "1 cup cooked and crumbled Italian sausage",
      },
      {
        name: "2 large mushrooms, sliced",
      },
      {
        name: "1/4 bell pepper, sliced",
      },
      {
        name: "1 tablespoon sliced black olives",
      },
      {
        name: "1 cup shredded mozzarella cheese",
      },
    ],
    instructions: [
      {
        value:
          "Preheat the oven to 475°. Spray pizza pan with nonstick cooking or line a baking sheet with parchment paper.",
      },
      {
        value: "Flatten dough into a thin round and place on the pizza pan.",
      },
      {
        value: "Spread pizza sauce over the dough.",
      },
      {
        value: "Layer the toppings over the dough in the order listed .",
      },
      {
        value:
          "Bake for 8 to 10 minutes or until the crust is crisp and the cheese melted and lightly browned.",
      },
    ],
  },
  {
    name: "Classic Burger",
    desc: "Sink your teeth into a delicious restaurant-style, hamburger recipe made from lean beef. Skip the prepackaged patties and take the extra time to craft up your own, and that little extra effort will be worth it.",
    time: "30mins",
    servings: 4,
    image: "recipe-burger.jpg",
    ingredients: [
      {
        ingredient: "Pizza Sauce",
        ingredient: "Cheese",
        ingredient: "Dough",
      },
    ],
    instructions: [
      {
        instruction: "Kneed Dough",
        instruction: "Add pizza sauce and toppings",
        instruction: "Cook pizza for 16 mins at 400 degrees",
      },
    ],
  },
  {
    name: "Chicken Biryani",
    desc: "Chicken Biryani is a bold and flavorful Indian dish with crazy tender bites of chicken with bell peppers in a deliciously spiced and fragrant rice.",
    time: "1h15mins",
    servings: 6,
    image: "recipe-pilaf.jpg",
    ingredients: [
      {
        ingredient: "Pizza Sauce",
        ingredient: "Cheese",
        ingredient: "Dough",
      },
    ],
    instructions: [
      {
        instruction: "Kneed Dough",
        instruction: "Add pizza sauce and toppings",
        instruction: "Cook pizza for 16 mins at 400 degrees",
      },
    ],
  },
  {
    name: "Ch. Chow Mein",
    desc: "A great Chow Mein comes down to the sauce - it takes more than just soy sauce and sugar! Jam packed with a surprising amount of hidden vegetables, customize this Chicken Chow Mein recipe using your protein of choice!",
    time: "20mins",
    servings: 4,
    image: "recipe-chowmein.jpg",
    ingredients: [
      {
        ingredientOne: "Chicken",
        ingredientTwo: "rice",
        ingredientThree: "Vegetables",
      },
    ],
    instructions: [
      {
        instructionOne: "Kneed Dough",
        instructionTwo: "Add pizza sauce and toppings",
        instructionThree: "Cook pizza for 16 mins at 400 degrees",
      },
    ],
  },
];

var _db = "";

var userExists = false;
var userFullName = "";
var _userProfileInfo = {
  recipes: [],
};
var recipes = [];

var uid = "";
_recipes = [];
var storage = "";
var storageRef = "";

function signInAnon() {
  firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      console.log("Signed In (Anon)");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error Signing in " + errorMessage);
    });
}

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Signed out");
    })
    .catch((error) => {
      console.log("error signing out");
    });
}

function createAccount() {
  let fName = $("#fNameSignUp").val();
  let lName = $("#lNameSignUp").val();
  let email = $("#emailSignUp").val();
  let password = $("#passwordSignUp").val();

  let fullName = fName + " " + lName;

  let userObj = {
    firstName: fName,
    lastName: lName,
    email: email,
    recipes: [],
  };

  console.log("Create " + fullName + email);

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
      console.log("created");
      firebase.auth().currentUser.updateProfile({
        displayName: fullName,
      });
      _db
        .collection("Users")
        .doc(user.uid)
        .set(userObj)
        .then((doc) => {
          console.log("User Info collected");
          _userProfileInfo = userObj.toString;
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          console.log("collect info Error " + errorMessage);
        });

      userFullName = fullName;
      $(".name").html(userFullName);
      $("#fNameSignUp").empty();
      $("#lNameSignUp").empty();
      $("#emailSignUp").empty();
      let password = $("#passwordSignUp").val();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
      console.log("Create Error " + errorMessage);
    });
}

function login() {
  let email = $("#emailLogin").val();
  let password = $("#passwordLogin").val();
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      uid = user.uid;
      console.log("Logged in as" + user.displayName);
      userFullName = user.displayName;
      $("#emailLogin").val("");
      $("#passwordLogin").val("");
      _db
        .collection("Users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          $.each(doc, function () {
            _userProfileInfo = doc.data();
            console.log(
              console.log("Login User Info," + JSON.stringify(_userProfileInfo))
            );
          });
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Error Signing in: " + errorMessage);
        });
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error Signing in: " + errorMessage);
    });
}

var gsReference = "";

userRecipes = {};

function initFirebase() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("auth changed logged in");
      _db = firebase.firestore();

      storage = firebase.storage();
      storageRef = storage.ref();
      gsReference = storage.refFromURL("gs://n320-final-project.appspot.com");
      uid = user.uid;
      userRecipes = _db.collection("Recipes").where("creator", "==", uid);
      console.log(userRecipes);
      let recipe = _db.collection("Recipes").get();
      recipe = JSON.stringify(recipe);

      _db
        .collection("Recipes")
        .get()
        .then((recipe) => {
          recipe.forEach((doc) => {
            let data = doc.data();
            recipes.push(data);
          });
          loadRecipes();
          console.log("recipes: " + recipes);
        });

      $(".name").html(user.displayName);
      if (user.displayName) {
        $(".loginNav").html(
          `<div class="signOut" onclick="signOut()"> Sign Out </div>`
        );
        $(".loginNav").attr("href", "#login");
      }
      userExists = true;
    } else {
      _db = "";
      signInAnon();
      userExists = false;
      console.log("auth changed Logged Out");
      $(".loginNav").html(`Login`).attr("href", "#login");
      userFullName = "";
      $("#create").attr("disabled", true);
    }
  });
}

$(document).ready(function () {
  initURLListener();
  try {
    let app = firebase.app();
    initFirebase();

    initListeners();
  } catch (error) {
    console.log("$(document).ready Error: " + error);
  }
});

function initListeners() {
  $("#signUp").submit(function (e) {
    e.preventDefault();
  });
  $(".bars").click(function (e) {
    $(".bars").toggleClass("active");
    $(".menu").toggleClass("active");
  });

  $(".menu .links a").click(function (e) {
    $(".bars").toggleClass("active");
    $(".menu").toggleClass("active");
  });
}

function initURLListener() {
  $(window).on("hashchange", changeRoute);
  changeRoute();
}

function changeRoute() {
  let hashTag = window.location.hash;
  let pageId = hashTag.replace("#", "");

  if (pageId != "") {
    $.get(`pages/${pageId}/${pageId}.html`, function (page) {
      $("#app").html(page);
    });
  } else {
    $.get(`pages/home/home.html`, function (page) {
      $("#app").empty();
      $("#app").html(page);
    });
  }

  if (pageId == "browse") {
    $.get(`pages/${pageId}/${pageId}.html`, function (page) {
      $("#app").html(page);
      loadRecipes();
    });
  } else if (pageId == "recipes") {
    $.get(`pages/${pageId}/${pageId}.html`, function (page) {
      $("#app").html(page);
      loadUserRecipes();
    });
  } else if (pageId == "create") {
    $.get(`pages/${pageId}/${pageId}.html`, function (page) {
      $("#app").html(page);
      $(".name").html(userFullName);
    });
  }
}

function loadUserRecipes() {
  let recipeStr = "<ul>";
  $.each(_userProfileInfo.recipes, function (idx, recipe) {
    _db
      .collection("Recipes")
      .doc(recipe)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("document:" + doc.data());
        } else {
          console.log("No such document");
        }
      });
    recipeStr += `<li id="{idx}" onclick="loadUserItem(${idx})">
    <div class="item">
            <div class="image">
                <div class="view" onclick="loadRecipe(${idx})"><span>View</span> </div>
                <img src="images/${recipe.image}" alt="">
            </div>
            <div class="text">
                <div class="title">
                    <h2>${recipe.name}</h2>
                </div>
                <div class="desc">
                    <span><p>${recipe.desc}</p></span>
                </div>
                <div class="time">
                    <img src="images/time.svg" alt="">
                    <span><p>${recipe.time}</p></span>
                </div>
                <div class="serving">
                    <img src="images/servings.svg" alt="">
                    <span><p>${recipe.servings}  servings</p></span>
                </div>
            </div>
            
        </div>
    <div class="buttonHolder">
<div class="edit" onclick="loadRecipe(${idx})"><span>Edit</span> </div>
        <div class="delete" onclick="loadRecipe(${idx})"><span>Delete</span> </div>
    </div>
    
        </li>`;
  });
  recipeStr += "</ul>";
  $(".wrapper").html(recipeStr);
}

function loadRecipes() {
  let listStr = "<ul>";
  console.log("recipes: " + recipes);
  $.each(recipes, function (idx, recipe) {
    recipeStorageRef = storageRef.child(recipe.image);
    recipeStorageRef
      .getDownloadURL()
      .then((url) => {
        $(`#img${idx}`).prop("src", url);
      })
      .catch((error) => {
        console.log("Image download error" + error.message);
      });
    listStr += `<li id="{idx}" onclick="loadRecipeItem(${idx})"><div class="item">
            <div class="image">
                <img id="img${idx}" src="" alt="">
            </div>
            <div class="text">
                <div class="title">
                    <h2>${recipe.name}</h2>
                </div>
                <div class="desc">
                    <span><p>${recipe.desc}</p></span>
                </div>
                <div class="time">
                    <img src="images/time.svg" alt="">
                    <span><p>${recipe.time}</p></span>
                </div>
                <div class="serving">
                    <img src="images/servings.svg" alt="">
                    <span><p>${recipe.servings}  servings</p></span>
                </div>
            </div>
        </div></li>`;
  });
  listStr += "</ul>";
  $(".wrapper").html(listStr);
}

function back() {
  $("#app").html(`<div class="recipes">
<div class="bgImage">
</div>
<div class="overlay">
    <div class="title">
        <h1>Recipes: Try some today!</h1>
    </div>
    <div class="wrapper"></div></div></div>`);
}

function loadUserItem(idx) {
  let instructionsStr = "";
  let ingredientsStr = "";
  $.each(RECIPES[idx].ingredients, function (id, ingredientItem) {
    console.log(ingredientItem);

    ingredientsStr += `<li id="${id}">${ingredientItem.name}</li>`;

    console.log(ingredientsStr);
  });
  console.log(RECIPES[idx].instructions);
  $.each(RECIPES[idx].instructions, function (id, instruction) {
    console.log(instruction);

    instructionsStr += `<li id="${id}">${instruction.value}</li>`;

    console.log(instructionsStr);

    return instructionsStr;
  });
  $("#app").empty();
  $("#app").html(`<div class="recipe">
<div class="back" onclick="back(),loadUserRecipes()">
<span>Go Back</span>
</div>
<div class="hero">
    <div class="verticalText">
        <span>
            ${RECIPES[idx].name}
        </span>
    </div>
    <div class="image">
        <img src="images/${RECIPES[idx].image}" alt="">
    </div>
</div>
<div class="desc">
    <h2>Description</h2>
    <span>${RECIPES[idx].desc}</span>
    <h3>Total Time:</h3>
    <span>${RECIPES[idx].time}</span>
    <h3>Servings:</h3>
    <span>${RECIPES[idx].servings}</span>
</div>
<div class="ingredients">
    <h2>Ingredients:</h2>
    <ul>
       ${ingredientsStr}
    </ul>
</div>
<div class="instructions">
    <h2>Instructions:</h2>
    <ol>
       ${instructionsStr}
    </ol>
</div>
</div>`);
}

function loadRecipeItem(idx) {
  let instructionsStr = "";
  let ingredientsStr = "";
  console.log("ingredient 1" + recipes[idx].ingredients[0]);
  $.each(recipes[idx].ingredients, function (id, ingredientItem) {
    console.log(ingredientItem);

    ingredientsStr += `<li id="${id}">${ingredientItem}</li>`;

    console.log(ingredientsStr);
  });
  console.log(recipes[idx].instructions);
  $.each(recipes[idx].instructions, function (id, instruction) {
    console.log(instruction);

    instructionsStr += `<li id="${id}">${instruction}</li>`;

    console.log(instructionsStr);

    return instructionsStr;
  });
  $("#app").empty();
  $("#app").html(`<div class="recipe">
<div class="back" onclick="back(),loadRecipes()">
<span>Go Back</span>
</div>
<div class="hero">
    <div class="verticalText">
        <span>
            ${recipes[idx].name}
        </span>
    </div>
    <div class="image">
        <img src="images/${recipes[idx].image}" alt="">
    </div>
</div>
<div class="desc">
    <h2>Description</h2>
    <span>${recipes[idx].desc}</span>
    <h3>Total Time:</h3>
    <span>${recipes[idx].time}</span>
    <h3>Servings:</h3>
    <span>${recipes[idx].servings}</span>
</div>
<div class="ingredients">
    <h2>Ingredients:</h2>
    <ul>
       ${ingredientsStr}
    </ul>
</div>
<div class="instructions">
    <h2>Instructions:</h2>
    <ol>
       ${instructionsStr}
    </ol>
</div>
<div id="edit">
</div>
</div>`);

  // If User created Item at edit button at bottom:
  if (uid == recipes[idx].creator) {
    $("#edit").html(
      `<div class="editBtn" onclick="editRecipe(${idx})" > Edit </div>`
    );
  } else {
    $("#edit").empty();
  }
}

function editRecipe(idx) {
  console.log(recipes[idx].ingredients);

  $(document).ready(function () {
    console.log(recipes[idx].name);
    $("#app").html(`<div class="create">
<div class="title">
    Hey
    <span class="name"></span>, edit your recipe!
</div>
<form onsubmit="return false">
    <div class="input">
        <label for="image">Change Recipe Image</label>
        <input type="file" placeholder="Add Recipe Image" value="Attach file" name="image" class="image" title="" id="image" accept=".jpg,.jpeg,.png" onchange="uploadRecipeImage()" value="${recipes[idx].image}">
    </div>
    <div class="input">
        <label for="name" id="nameLabel">Recipe Name</label>
        <input type="text" id="name" value="${recipes[idx].name}" required>
    </div>
    <div class="input">
        <label for="desc">Recipe Description</label>
        <input type="text" id="desc" value="${recipes[idx].desc}"required>
    </div>
    <div class="input">
        <label for="time">Recipe Total Time</label>
        <input type="text" id="time" value="${recipes[idx].time}"required>
    </div>
    <div class="input">
        <label for="servings">Recipe Serving Size</label>
        <input type="text" id="servings" value="${recipes[idx].servings}"required>
    </div>
    <div class="ingredients">
        <h1>Enter Ingredients</h1>
        
    </div>
    <div class="addIngredients">
        <input type="submit" value="Add an additional Ingredient" onclick="addIngredient()">
    </div>
    <div class="instructions">
        <h1>Enter Instructions:</h1>
        
        
    </div>
    <div class="addInstructions">
        <input type="submit" value="Add an additional Instruction" onclick="addInstruction()">
    </div>
    <div class="submit">
        <input type="submit" value="Update Recipe" class="create" onclick="updateRecipeInfo(${idx})">
    </div>
</form>
</div>`);

    $.each(recipes[idx].ingredients, function (id, ingredient) {
      console.log(ingredient);
      ingredientId = id + 1;
      $(".ingredients").append(`
    <div class="input">
            <label for="ingredient${ingredientId}">Ingredient #${ingredientId}</label>
            <input type="text" class="ingredient" id="ingredient${ingredientId}" value="${ingredient}">
        </div>
    `);
    });
    $.each(recipes[idx].instructions, function (id, instruction) {
      console.log(instruction);
      instructionId = id + 1;
      $(".instructions").append(`
    <div class="input">
            <label for="Instruction${instructionId}">Instruction #${instructionId}</label>
            <input type="text" class="instruction" id="instruction${instructionId}" value="${instruction}">
        </div>
    `);
    });
  });
}

var currentIngredientIndex = 3;

function addIngredient() {
  currentIngredientIndex += 1;
  ingredientId = "ingredient" + currentIngredientIndex;
  $(".ingredients").append(`
<div class="input"><label for="${ingredientId}">Ingredient # ${currentIngredientIndex}</label>
<input type="text" class="ingredient" id="${ingredientId}"></div>
`);
  console.log(ingredientId);
}

currentInstructionIndex = 3;

function addInstruction() {
  currentInstructionIndex += 1;
  instructionId = "instruction" + currentInstructionIndex;
  $(".instructions").append(`
<div class="input">
            <label for="${instructionId}">Instruction #${currentInstructionIndex}</label>
            <input type="text" id="${instructionId}">
        </div>
`);
}

function uploadRecipeImage() {
  let image = $("#image")[0].files[0];

  var imagesRef = storageRef.child(image.name);
  imagesRef.put(image).then((snapshot) => {
    console.log(`Uploaded ${image.name}!`);
  });
}

function addRecipe() {
  let newRecipeName = $("#name").val();
  let newRecipeDesc = $("#desc").val();
  let newRecipeTime = $("#time").val();
  let newRecipeServings = $("#servings").val();
  let image = $("#image")[0].files[0];

  let imageUrl = image.name;
  let ingredients = [];
  let instructions = [];

  $.each($(".ingredient"), function (index) {
    index += 1;
    ingredientId = "#ingredient" + index;
    ingredient = $(ingredientId).val();
    ingredients.push(ingredient);
  });
  $.each($(".instruction"), function (index) {
    index += 1;
    instructionId = "#instruction" + index;
    instruction = $(instructionId).val();
    instructions.push(instruction);
  });
  let newRecipeObj = {
    name: newRecipeName,
    desc: newRecipeDesc,
    time: newRecipeTime,
    servings: newRecipeServings,
    image: imageUrl,
    ingredients: ingredients,
    instructions: instructions,
    creator: uid,
  };

  _db
    .collection("Recipes")
    .doc(newRecipeObj.name)
    .set(newRecipeObj)
    .then(() => {
      alert("Recipe Added");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  recipes.push(newRecipeObj.name);
  _userProfileInfo.recipes.push(newRecipeObj.name);
  updateUserInfo(_userProfileInfo);
  console.log(_userProfileInfo);
  loadRecipes();
}

function updateUserInfo(userObj) {
  let id = firebase.auth().currentUser.uid;
  _db
    .collection("Users")
    .doc(id)
    .update(userObj)
    .then(() => {
      console.log("updated doc");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Update user Error" + errorMessage);
    });
}

function updateRecipeInfo(index) {
  let newRecipeName = $("#name").val();
  let newRecipeDesc = $("#desc").val();
  let newRecipeTime = $("#time").val();
  let newRecipeServings = $("#servings").val();
  let image = $("#image")[0].files[0];

  let imageUrl = recipes[index].image;
  let ingredients = [];
  let instructions = [];

  $.each($(".ingredient"), function (index) {
    index += 1;
    ingredientId = "#ingredient" + index;
    ingredient = $(ingredientId).val();
    ingredients.push(ingredient);
  });
  $.each($(".instruction"), function (index) {
    index += 1;
    instructionId = "#instruction" + index;
    instruction = $(instructionId).val();
    instructions.push(instruction);
  });

  let updatedRecipeObj = {
    name: newRecipeName,
    desc: newRecipeDesc,
    time: newRecipeTime,
    servings: newRecipeServings,
    image: imageUrl,
    ingredients: ingredients,
    instructions: instructions,
    creator: uid,
  };
  console.log(updatedRecipeObj);
  _db
    .collection("Recipes")
    .doc(newRecipeName)
    .update(updatedRecipeObj)
    .then(() => {
      alert("Recipe Updated");
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
}
