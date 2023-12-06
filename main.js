let input = document.getElementById("inp");
let ul = document.getElementById("u");
let q = document.querySelectorAll(".rep");
let wrapper = document.querySelector(".wrapper");

const debounce = (fn, delay) => {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

async function searchRepositories() {
  return await fetch(
    `https://api.github.com/search/repositories?q=${input.value}&per_page=5`
  )
    .then((res) => {
      return res.json().then((data) => {
        return data.items;
      });
    })
    .catch((err) => console.log(err));
}

input.addEventListener(
  "keyup",
  debounce(async function (e) {
    const repositories = await searchRepositories();
    createFields(repositories);
  }, 450)
);

function createFields(repositories) {
  let qArr = Array.prototype.slice.call(q);
  if (input.value.trim() === "") {
    qArr.forEach((element) => {
      element.innerHTML = "";
    });
    ul.style.visibility = "hidden";
  } else {
    qArr.forEach((element, i) => {
      if (repositories[i]) {
        element.innerHTML = `${repositories[i].name}`;
        element.onclick = function () {
          selectedRepository(repositories[i]);
        };
      } else {
        element.innerHTML = "";
      }
    });
    ul.style.visibility = "visible";
  }
}

function selectedRepository(repo) {
  let div = document.createElement("div");
  let closeBtn = document.createElement("button");
  closeBtn.addEventListener("click", () => {
    div.remove();
  });
  div.className = "selected";
  div.innerText =
    "Name: " +
    repo.name +
    "\n" +
    "Owner: " +
    repo.owner.login +
    "\n" +
    "Stars: " +
    repo.stargazers_count +
    " ";
  closeBtn.className = "close";
  closeBtn.innerText = "x";
  closeBtn.style.color = "red";
  div.append(closeBtn);
  wrapper.append(div);
  input.value = "";
  ul.style.visibility = "hidden";
}
