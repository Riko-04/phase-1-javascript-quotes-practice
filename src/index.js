document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.getElementById("quote-list");
    const newQuoteForm = document.getElementById("new-quote-form");
  
    // Function to fetch quotes and populate the page
    function fetchQuotes() {
      fetch("http://localhost:3000/quotes?_embed=likes")
        .then(response => response.json())
        .then(quotes => {
          quotes.forEach(quote => renderQuote(quote));
        })
        .catch(error => console.error("Error fetching quotes:", error));
    }
  
    // Function to render a single quote on the page
    function renderQuote(quote) {
      const li = document.createElement("li");
      li.classList.add("quote-card");
      li.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      `;
      
      // Event listener for like button
      const likeBtn = li.querySelector(".btn-success");
      likeBtn.addEventListener("click", () => {
        likeQuote(quote.id);
      });
  
      // Event listener for delete button
      const deleteBtn = li.querySelector(".btn-danger");
      deleteBtn.addEventListener("click", () => {
        deleteQuote(quote.id, li);
      });
  
      quoteList.appendChild(li);
    }
  
    // Function to create a new quote
    newQuoteForm.addEventListener("submit", event => {
      event.preventDefault();
      const quoteInput = document.getElementById("new-quote");
      const authorInput = document.getElementById("author");
      const quoteText = quoteInput.value;
      const author = authorInput.value;
      
      createQuote(quoteText, author);
      quoteInput.value = "";
      authorInput.value = "";
    });
  
    // Function to handle creation of a new quote
    function createQuote(quoteText, author) {
      fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ quote: quoteText, author })
      })
        .then(response => response.json())
        .then(quote => renderQuote(quote))
        .catch(error => console.error("Error creating quote:", error));
    }
  
    // Function to handle liking a quote
    function likeQuote(quoteId) {
      fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ quoteId })
      })
        .then(response => response.json())
        .then(() => {
          const likeBtn = document.querySelector(`[data-id="${quoteId}"] .btn-success`);
          const span = likeBtn.querySelector("span");
          const currentLikes = parseInt(span.textContent);
          span.textContent = currentLikes + 1;
        })
        .catch(error => console.error("Error liking quote:", error));
    }
  
    // Function to handle deletion of a quote
    function deleteQuote(quoteId, li) {
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: "DELETE"
      })
        .then(() => {
          li.remove();
        })
        .catch(error => console.error("Error deleting quote:", error));
    }
  
    // Initialize by fetching quotes
    fetchQuotes();
  });
  