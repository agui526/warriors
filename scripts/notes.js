(function () {

    let note = {

        LOCAL_STORAGE_KEY: 'agui-notes',

        init() {
            this.notes = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY)) || [];
            this.selectedIndex = null;

            this.$el = document.querySelector('#app');
            this.$main = this.$el.querySelector('.main-view');
            this.$note = this.$el.querySelector('.note-view');
            this.$notes = this.$el.querySelector('.notes');
            // this.$trash = this.$note.querySelector('.nav-btn-trash');  
            this.$editor = this.$note.querySelector('.editor');
            this.$searchInput = this.$el.querySelector('#search');

            this.$el.addEventListener('click', this, false);
            this.$el.addEventListener('keyup', this, false);

            this.render(this.notes);

        },


        handleEvent(event) {
            let $target = event.target;

            switch (true) {
                case $target.matches('.fa-pencil-square-o'):
                    this.add();
                    break;
                case $target.matches('.fa-chevron-left'):
                    this.back();
                    break;
                case $target.matches('.note'):
                    this.view(event);
                    break;
                case $target.matches('.fa-trash'):
                    this.delete();
                    break;
                case $target.matches('#search') && event.type === 'keyup':
                    this.search(event);
                    break;
            }


        },

        add() {
            this.selectedIndex = null;
            this.$note.classList.add('push');
        },

        back() {
            if (this.selectedIndex === null && this.$editor.value.length > 0) {
                this.notes.push({
                    text: this.$editor.value
                });
            }

            // 当前正在查看便签
            if (this.selectedIndex !== null) {
                this.notes[this.selectedIndex].text = this.$editor.value;
            }

            this.save();
            this.clear();
            this.render(this.notes);
            this.pop();
        },

        save() {
            localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.notes));
        },
        clear() {
            this.$editor.value = '';
        },
        render(arr) {
            this.$notes.innerHTML = arr
                .map(function (note, i) {
                    return `<div class='note' data-index='${i}'>${note.text}</div>`;
                })
                .join('');
        },
        pop() {
            this.$note.classList.remove('push');
        },

        view(event) {
            this.selectedIndex = event.target.dataset.index;
            this.$editor.value = this.notes[this.selectedIndex].text;
            this.$note.classList.add('push');
        },

        delete() {
            this.$editor.value = '';
            this.notes.splice(this.selectedIndex, 1);
            this.save();
            this.render(this.notes);
            this.pop();
        },

        search(event) {
            let searchText = event.target.value;
            let searchReg = new RegExp(searchText);
            this.searchNotes = this.notes.filter(function(note) {
                return note.text.indexOf(searchText) > 0;
            }).map(function(note, i) {
                return `<div class='note' data-index='${i}'>` + 
                    `${note.text}`.replace(searchReg, `<span class="search">${searchText}</span>`) + `</div>`
            });

            if (searchText) {
                this.$notes.innerHTML = this.searchNotes.join('');
            } else {
                this.render(this.notes);
            }
        }

    }

    document.addEventListener('DOMContentLoaded', function () {
        note.init();
    });

})()