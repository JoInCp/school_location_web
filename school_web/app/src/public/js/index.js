function search() {
  var searchValue = document.getElementById('searchInput').value;
  performSearch(searchValue);
}

function performSearch(searchValue) {
  var request = new XMLHttpRequest();
  request.open('GET', './data.json', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText).list;

      var foundItems = data.filter(function(item) {
        var subjectMatch = item.subject.toLowerCase().includes(searchValue.toLowerCase());
        var nameMatch = item.name.toLowerCase().includes(searchValue.toLowerCase());
        return subjectMatch || nameMatch;
      });

      var searchResult = document.getElementById('searchResult');
      searchResult.innerHTML = '';

      if (foundItems.length > 0) {
        foundItems.forEach(function(foundItem, index) {
          var itemElement = document.createElement('div');
          itemElement.classList.add('result-item');

          var subjectElement = document.createElement('span');
          subjectElement.classList.add('subject');
          subjectElement.textContent = foundItem.subject;

          var nameElement = document.createElement('span');
          nameElement.classList.add('name');
          nameElement.textContent = foundItem.name;
          nameElement.addEventListener('click', function() {
            var existingImage = itemElement.querySelector('.result-image');
            if (existingImage) {
              existingImage.remove();
            } else {
              var imageElement = document.createElement('img');
              imageElement.src = 'images/' + foundItem.image;
              imageElement.classList.add('result-image');
              imageElement.addEventListener('click', function() {
                var modal = document.getElementById('myModal');
                var modalImage = document.getElementById('modalImage');
                modal.style.display = 'block';
                modalImage.src = this.src;

                var closeBtn = document.getElementsByClassName('close')[0];
                closeBtn.onclick = function() {
                  modal.style.display = 'none';
                };
              });

              itemElement.appendChild(imageElement);
            }
          });

          itemElement.appendChild(subjectElement);
          itemElement.appendChild(document.createTextNode(' '));
          itemElement.appendChild(nameElement);

          if (index !== foundItems.length - 1) {
            itemElement.appendChild(document.createElement('br'));
          }

          searchResult.appendChild(itemElement);
        });
      } else {
        var notFoundElement = document.createElement('div');
        notFoundElement.textContent = '정확하게 입력해주세요.';
        searchResult.appendChild(notFoundElement);
      }
    } else {
      console.error('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  request.onerror = function() {
    console.error('데이터를 불러오는 중 오류가 발생했습니다.');
  };

  request.send();
}

document.getElementById('searchInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    var searchValue = document.getElementById('searchInput').value;
    performSearch(searchValue);
  }
});