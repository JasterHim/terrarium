class Controls {
    _isRunning = false;

    constructor (terra) {
        this._terra = terra;
    }

    _startStopButton() {
        const button = document.createElement ('button');
        button.innerText = 'Start';
        button.addEventListener ("click",  () => {
            if (this._isRunning) {
                button.innerText = 'Start';
                this._terra.stop();
            } else {
                button.innerText = 'Stop';
                this._terra.start();
            }
            this._isRunning = !this._isRunning;
        })

        return button;
    }

    _saveButton() {
        const button = document.createElement ('button');
        button.innerText = 'Save';
        button.addEventListener ("click",  () => {
            let saveName = document.querySelector('#save-name');

            if (saveName)  {
                if (!saveName.value && !saveName.value.trim()) {
                    return;
                }
                const name = saveName.value;
                let saves = window.localStorage.getItem('saves') || "[]";

                saves = JSON.parse(saves);
                saves.push({
                    name,
                    map: this._terra.save(),
                });
                saves = JSON.stringify(saves);

                window.localStorage.setItem('saves', saves);
                button.parentElement.removeChild(saveName);

            } else {
                saveName = document.createElement('input');
                saveName.id ="save-name";
                saveName.setAttribute('placekolder', 'Save file name');

                button.parentElement.appendChild(saveName);
            }

        })

        
        return button;
    }

    _loadButton() {
        const button = document.createElement ('button');
        button.innerText = 'Load';
        button.addEventListener ("click",  () => {
            let loadName = document.querySelector('#load-name');
            let saves = window.localStorage.getItem('saves') || "[]";
            saves = JSON.parse(saves);
            
            if (loadName)  {
                if (!loadName.value) {
                    return button.parentElement.removeChild(loadName);
                }
                const name = loadName.value;
                
                const save = saves.find ((save) => save.name === name);
                if (save) {
                    this._terra.load(save.map);
                    this._terra.draw();
                }
                
                button.parentElement.removeChild(loadName);

            } else {
                loadName = document.createElement('select');
                loadName.id ="load-name";
                loadName.value = '';

                const none = document.createElement('option');
                none.label = "None";
                none.value = '';
                loadName.appendChild(none);
                
                for (const save of saves) {
                    const option = document.createElement('option');
                    option.label = save.name;
                    option.value = save.name;
                    loadName.appendChild(option);
                }

                button.parentElement.appendChild(loadName);
            }

        })

        
        return button;
    }

    _editButton() {
        const button = document.createElement ('button');
        button.innerText = 'Edit';
        button.addEventListener ("click",  () => {
            button.innerText = this._terra.isEdited 
            ? 'Edit'
            : "Stop editing";
            this._terra.editMode(!this._terra.isEdited);
        });

        return button;
    }

    render () {
        const container = document.createElement('div');
        container.appendChild(this._startStopButton());
        container.appendChild(this._saveButton());
        container.appendChild(this._loadButton());
        container.appendChild(this._editButton());

        return container;
    }
}