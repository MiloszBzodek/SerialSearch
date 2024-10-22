// Funkcja wywoływana po załadowaniu strony
window.onload = function() {
    showsApp.init();  // Inicjalizacja aplikacji
}

// Obiekt showsApp zawierający dane i metody do obsługi aplikacji
let showsApp = {
    data: null,  // Zmienna przechowująca dane o serialach
    searchInput: null,  // Element input do wprowadzania wyszukiwania
    showsDataSection: null,  // Sekcja do wyświetlania danych o serialach

    // Metoda inicjalizacyjna uruchamiana po załadowaniu strony
    init: function() {
        console.log("app started");  // Testowy komunikat w konsoli, potwierdzający start aplikacji

        // Pobranie elementu input dla wyszukiwania
        this.searchInput = document.getElementById("search-input");

        // Dodanie event listenera dla klawiatury, wyszukiwanie uruchamia się po wciśnięciu Enter (kod klawisza 13)
        this.searchInput.addEventListener("keyup", (e) => {
            if(e.keyCode == 13) {  // Sprawdzamy, czy wciśnięto Enter
                console.log("Enter clicked");  // Informacja w konsoli, że Enter został naciśnięty
                this.loadData( this.searchInput.value );  // Ładowanie danych na podstawie wpisanej frazy
            }
        });

        // Pobranie referencji do sekcji, gdzie wyświetlone będą dane o serialach
        this.showsDataSection = document.querySelector(".shows-data-section");

        // Załadowanie danych dla domyślnego wyszukiwania (np. "people" na początek)
        this.loadData("people");
    },

    // Metoda do pobierania danych o serialach z API TVMaze
    loadData: function(str) {
        // Użycie fetch do pobrania danych na podstawie wpisanej frazy
        fetch("https://api.tvmaze.com/search/shows?q=" + str.trim())
        .then(response => response.json())  // Konwersja odpowiedzi do formatu JSON
        .then(data => this.dataReady(data))  // Wywołanie metody dataReady po otrzymaniu danych
    },

    // Metoda wywoływana po pobraniu danych z API, przygotowuje dane do wyświetlenia
    dataReady: function(showData) {
        this.data = showData;  // Przypisanie pobranych danych do zmiennej
        // console.log(showData); // Możliwe użycie konsoli do podglądu pobranych danych

        let allBoxesHtml = "";  // Zmienna przechowująca HTML do wyświetlenia wszystkich seriali

        // Pętla przez wszystkie pobrane dane o serialach
        for(let i = 0; i < showData.length; i++) {
            let show = showData[i];  // Pobranie pojedynczego elementu (serialu)
            let score = show.score;  // Pobranie oceny serialu (na razie nie używane)
            show = show.show;  // Przejście do właściwych danych serialu

            console.log(show);  // Konsola pokazuje każdy serial

            // Połączenie gatunków w jeden ciąg znaków
            let genres = show.genres.join(", ");
            
            // Zmienna dla obrazków serialu (jeśli są dostępne)
            let imgSrc = null;
            let imgSrcOriginal = null;

            // Sprawdzanie czy serial ma przypisane obrazki
            if(show.image) {
                imgSrc = show.image.medium;  // Obrazek średniej wielkości
                imgSrcOriginal = show.image.original;  // Oryginalny obrazek
            } else {
                // Domyślny obrazek w przypadku braku grafiki serialu
                imgSrc = "https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459_640.png";
                imgSrcOriginal = "https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459_640.png";
            }

            // Sprawdzenie, czy serial ma przypisaną nazwę, jeśli nie - pomijamy go
            let showTitle = null;
            if (!show.name) continue;
            showTitle = show.name;

            // Sprawdzenie dostępności informacji o sieci telewizyjnej
            let network = "-";
            if(show.network) network = show.network.name;

            // Sprawdzenie dostępności oficjalnej strony serialu
            let officialSite = "-";
            if(show.officialSite) officialSite = show.officialSite;

            // Sprawdzenie daty premiery serialu
            let premiered = "-";
            if(show.premiered) premiered = show.premiered;

            // Pobranie opisu serialu i dodanie podstawowych informacji o serialu
            let summary = show.summary;
            summary = `
                <p>Show: ${showTitle} </p>
                <p>Date: ${premiered} </p>
                <p>Network: ${network} </p>
                <br>
            ` + summary;

            // Generowanie HTML dla jednego serialu i dodawanie do całości
            allBoxesHtml += this.getShowBoxByTemplate(imgSrc, showTitle, genres, summary);
        }

        // Wstawienie wygenerowanego HTML do sekcji wyświetlania danych o serialach
        this.showsDataSection.innerHTML = allBoxesHtml;
    },

    // Metoda tworząca HTML dla jednego serialu na podstawie przekazanych danych
    getShowBoxByTemplate: function(imgSrc, title, genres, overview) {
        return `
            <div class="show-box">
                <img src="${imgSrc}" alt="">
                <div class="show-title">${title}</div>
                <div class="show-genres">${genres}</div>
                <div class="show-overview">${overview}</div>
            </div>
        `;
    }
}
