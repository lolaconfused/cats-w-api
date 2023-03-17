class CatsInfo {
    constructor(
        selectorTemplate, 
        handleEditCatInfo,
        handleDeleteCat
    ) {
        this._selectorTemplate = selectorTemplate;
        this._handleEditCatInfo = handleEditCatInfo;
        this._handleDeleteCat = handleDeleteCat;
        this._data = {};
    }

    setData(newElement) {
        this._newElement = newElement;
        this._data = this._newElement.getData();
        console.log(this._data);

        this.catImage.src = this._data.image;
        this.catDesc.textContent = this._data.description;
        this.catName.textContent = this._data.name;
        this.catAge.textContent = this._data.age;
        this.catId.textContent = this._data.id;

        this.catAgeText.textContent = printNumerals(this._data.age, ["год", "года", "лет"]);
        
        this.catRate.innerHTML = generateRating(this._data.rate)

    }


    _getTemplate() {
        return document.querySelector(this._selectorTemplate).content.children[0];
    }

       _toggleContentEditable = () => {

        this.buttonEdited.classList.toggle('cat-info__edited_hidden');
        this.buttonSaved.classList.toggle('cat-info__saved_hidden');

        this.catDesc.contentEditable = !this.catDesc.isContentEditable;
        this.catName.contentEditable = !this.catName.isContentEditable;
        this.catAge.contentEditable = !this.catAge.isContentEditable;

       }

      _savedDataCats = () => {
        this._toggleContentEditable();

        this._data.name = this.catName.textContent;
        this._data.age = Number(this.catAge.textContent);
        this._data.description = this.catDesc.textContent;

        this._handleEditCatInfo(this._newElement, this._data)

      }

    getElement() {
        this.element = this._getTemplate().cloneNode(true);

        this.buttonEdited = this.element.querySelector('.cat-info__edited');
        this.buttonSaved = this.element.querySelector('.cat-info__saved');
        this.buttonDeleted = this.element.querySelector('.cat-info__deleted');
        
        this.catImage = this.element.querySelector('.cat-info__image');
        this.catId = this.element.querySelector('.cat-info__id');
        this.catName = this.element.querySelector('.cat-info__name');
        this.catRate = this.element.querySelector('.cat-info__rate');
        this.catAge = this.element.querySelector('.cat-info__age-val');
        this.catAgeText = this.element.querySelector('.cat-info__age-text');
        this.catDesc = this.element.querySelector('.cat-info__desc');
        this.setEventListener();
        return this.element;
    }

    setEventListener() {
    this.buttonDeleted.addEventListener('click', () => this._handleDeleteCat(this._newElement));
    this.buttonEdited.addEventListener('click', this._toggleContentEditable);
    this.buttonSaved.addEventListener('click', this._savedDataCats);
}
}