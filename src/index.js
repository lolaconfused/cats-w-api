const cardsContainer = document.querySelector('.cards');
const btnOpenPopup = document.querySelector('#add');
const btnOpenPopupLogin = document.querySelector('#login');
const formCatAdd = document.querySelector('#popup-form-add')
const formLogin = document.querySelector('#popup-form-login')
const isAuth = Cookies.get("email");
const MAX_LIVE_STORAGE = 1;
const MAX_RATE_CAT = 10;

const popupAdd = new Popup('popup-add');
const popupImage = new PopupWithImage('popup-cat-image');
const popupLogin = new Popup('popup-login');
const popupCatInfo = new Popup('popup-cat-info');

const catsInfoInstance = new CatsInfo(
  '#cats-info-template', 
   handleEditCatInfo,
   handleCatDelete
)
const catsInfoElement = catsInfoInstance.getElement()

function serializeForm(elements) {
    const formData = {};

    elements.forEach( input => {
        if (input.type === 'submit' || input.type === 'button') return;
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        }
        if (input.type !== 'checkbox') {
            formData[input.name] = input.value;

        }
    });

    return formData;
}

function createCat(dataCat){
  const newElement = new Card(dataCat, '#card-template', handleClickCatImage
  , 
  handleCatTitle
  );
  cardsContainer.prepend(newElement.getElement());

}
  
function handleFormAddCat(e) {
    e.preventDefault();
    const elementsFormCat = [...formCatAdd.elements];
    const formData = serializeForm(elementsFormCat);
    api.addNewCat(formData)
      .then(function() {
        createCat(formData);
        updateLocalStorage(formData, {type: 'ADD_CAT'});
        popupAdd.close();
      })
      .catch(function(err){
        console.log(err);
      })
}

function handleClickCatImage(dataSrc) {
    popupImage.open(dataSrc)
}

function handleFormLogin(e) {
  e.preventDefault();
  const elementsFormLogin = [...formLogin.elements];
  const formData = serializeForm(elementsFormLogin);
  Cookies.set("email", formData.email, {expires: 30});
  btnOpenPopup.classList.remove('visually-hidden');
  btnOpenPopupLogin.classList.add('visually-hidden');
  popupLogin.close();
}


btnOpenPopup.addEventListener('click', (e) => {
    e.preventDefault();
    popupAdd.open();
});

btnOpenPopupLogin.addEventListener('click', (e) => {
  e.preventDefault();
  popupLogin.open();
});

function setDataRefresh(minute, key) {
  const setTime = new Date(new Date().getTime() + minute*60000);
  localStorage.setItem(key, setTime);
  return setTime;
}

function updateLocalStorage(data, action) {
  const oldStorage = JSON.parse(localStorage.getItem('cats'));

  switch (action.type) {
    case 'ADD_CAT':
      oldStorage.push(data);
      localStorage.setItem('cats', JSON.stringify(oldStorage));
      return;
    case 'ALL_CATS':
      setDataRefresh(MAX_LIVE_STORAGE, 'catsRefresh');
      localStorage.setItem('cats', JSON.stringify(data));
      return;
    case 'DELETE_CAT':
      const newStorage = oldStorage.filter(cat=> cat.id !== data.id)
      localStorage.setItem('cats', JSON.stringify(newStorage));
      return;
    case 'EDIT_CAT':
    const updateStorage = oldStorage.map(cat => cat.id === data.id ? data : cat);
    localStorage.setItem('cats', JSON.stringify(updateStorage));
      return;
    default:
      break;
  }
}

function handleCatTitle(newElement){
  console.log(newElement);
  catsInfoInstance.setData(newElement);
  popupCatInfo.setContent(catsInfoElement);
  popupCatInfo.open();
}
    function handleCatDelete(newElement){
      api.deleteCatById(newElement.getId())
      .then(() => {
        newElement.deleteView();
           updateLocalStorage(newElement.getData(), {type: DELETE_CAT});
        popupCatInfo.close()
      })
      console.log(handleCatDelete);
    }

        function handleEditCatInfo(newElement, data) {
          const {age, description, name, id} = data;

          api.updateCatById(id, {age, description, name})
            .then(()=> {
              newElement.setData(data);
              newElement.updateView();
      
              updateLocalStorage(data, {type: 'EDIT_CAT'});
              popupCatInfo.close()
            })

        }
function generateRating(rate) {
  const rateElements = [];
  for (let index = 0; index < MAX_RATE_CAT; index++) {
if (index < rate && rate % 1 === 0) {
  rateElements.push('<i class="fa-solid fa-star"></i>')
} else if (index < Math.floor(rate) && rate % 1 !== 0) {
  rateElements.push('<i class="fa-solid fa-star"></i>')
} else if (index === Math.floor(rate) && rate % 1 !== 0) {
  rateElements.push('<i class="fa-solid fa-star-half-stroke"></i>')
} else {
  rateElements.push('<i class="fa-regular fa-star"></i>')

}

}
return rateElements.join("");
}
    const printNumerals = (number, titles) => {
      number = Math.abs(number);
      if (Number.isInteger(number)) {
        const cases = [2, 0, 1, 1, 1, 2];
        const text =
          titles[
            number % 100 > 4 && number % 100 < 20
            ? 2
            : cases[number % 10 < 5 ? number % 10 : 5]
          ];
        return `${text}`;
      }
      return `${titles[1]}`;
    };


function checkLocalStorage() {
  const localData = JSON.parse(localStorage.getItem('cats'));
  const getTimeExpires = localStorage.getItem('catsRefresh');
  
  if (localData && localData.length && new Date() < new Date(getTimeExpires)) {
    localData.forEach( catData => {
      createCat(catData);
    });
  } else {
    api.getAllCats()
    .then(dataCats => {
       dataCats.forEach( catData => {
        createCat(catData);
      });
       updateLocalStorage(dataCats, {type: 'ALL_CATS'});
    })
    .catch(function(err){
     console.log(err);
   })
 
  }
}

formCatAdd.addEventListener('submit', handleFormAddCat);
formLogin.addEventListener('submit', handleFormLogin);


if (!isAuth) {
  popupLogin.open();
  btnOpenPopup.classList.add('visually-hidden');
} else {
  btnOpenPopupLogin.classList.add('visually-hidden');
}


popupAdd.setEventListener();
popupImage.setEventListener();
popupLogin.setEventListener();
popupCatInfo.setEventListener();


checkLocalStorage();
