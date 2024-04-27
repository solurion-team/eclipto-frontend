import { Component } from '@angular/core';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent {
  const sidebar = document.querySelector(".sidebar");
  const icon = document.querySelector(".icon");
  const cardContainer = document.querySelector(".card-container");
  const plus = document.querySelector(".plus");

  function ShowSidebar() {
    if (sidebar.classList.contains("active")) {
      sidebar.classList.remove("active");
    } else {
      sidebar.classList.add("active");
    }

    if (icon.textContent === ">") {
      icon.textContent = "<";
    } else {
      icon.textContent = ">";
    }
  }

  icon.addEventListener("click", ShowSidebar);

  let addingCard = false
  function addCard() {
    if (addingCard) return
    addingCard = true
    let card_input = document.createElement('div')
    let input = document.createElement('input')
    input.type = 'text'
    card_input.appendChild(input)
    cardContainer.appendChild(card_input)

    function send(event) {
      let cardText = input.value
      if (cardContainer.contains(card_input))
      {
        input.remove()
        card_input.remove()
      }

      if (cardText !== null && cardText.trim() !== "") {
        const card = document.createElement("div")
        card.classList.add("card")

        const square = document.createElement("div")
        square.classList.add("square")
        card.appendChild(square)

        const textCard = document.createElement("div")
        textCard.classList.add("text-card")
        textCard.textContent = cardText
        card.appendChild(textCard)

        cardContainer.appendChild(card)
      }
      addingCard = false
    }

    let enter_or_pressed = false;
    input.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        console.log("enter");
        enter_or_pressed = true;
        send();
      } else if (event.key === 'Escape') {
        console.log("escape");
        enter_or_pressed = true;
        card_input.remove()
      }
      addingCard = false
    });

    input.addEventListener('blur', function() {
      if (!enter_or_pressed) {
        console.log("blur");
        send();
      }
      enter_or_pressed = false;
    });
  }

  plus.addEventListener("click", addCard)
}

