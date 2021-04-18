HTMLFormElement.prototype.save = function(config) {

    let form = this;
    form.addEventListener('submit', e => {
        e.preventDefault();
        let formData = new FormData(form); // gerencia dados de formulário

        console.log(formData)

        // passando dados via AJAX
        fetch(form.action, {
          method: form.method,
          body: formData
        })
        .then(response => response.json() )
        .then(json => {
            if (json.error) { 
                if (typeof config.failure === 'function') config.failure(json.error);    
            } else { 
                if (typeof config.success === 'function') config.success(json);
             }
        }).catch(err => {
            if (typeof config.failure === 'function') config.failure(err);
        });
    });
}