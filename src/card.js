class Card {
    #data;
    #selectorTemplate;
    #element;
    #handleClickCatImage;
    #handleCatTitle;
    #getTemplate(){
        const template = document.querySelector(this.#selectorTemplate).content.querySelector('.card');
        return template
    }

    constructor(data, selectorTemplate, handleClickCatImage, handleCatTitle) {
        this.#data = data;
        this.#selectorTemplate =selectorTemplate;
        this.#handleClickCatImage = handleClickCatImage;
        this.#handleCatTitle = handleCatTitle;

    }

    getElement() {
        this.#element = this.#getTemplate().cloneNode(true);
        const cardTitleElement = this.#element.querySelector('.card__name');
        const cardImageElement = this.#element.querySelector('.card__image');
        const cardLikeElement = this.#element.querySelector('.card__like');

        cardTitleElement.textContent = this.#data.name;
        cardImageElement.src = this.#data.image;

        if(!this.#data.favorite) {
            cardLikeElement.remove()
        }

        cardTitleElement.addEventListener('click', () => {
            this.#handleCatTitle(this);
        })

        cardImageElement.addEventListener('click', () => {
            this.#handleClickCatImage(this.#data.image);
        })


        return this.#element;
    }

    getData() {
        return this.#data;
    }

    getId(){
        return this.#data.id;
    }

    setData(newData){
        this.#data = newData;
    }

    updateView() {
        this.cardTitleElement.textContent = this.#data.name;
        this.cardImageElement.src = this.#data.image;
    }


    deleteView() {
        this.#element.remove();
        this.#element = null;
    }

}