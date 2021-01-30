const loadNewPost = () => {
    fetch(`http://localhost:3000/api/posts/new`, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            post: document.getElementById("new-post").value
        })
    })
        .then(resp => resp.text())
        .then(resp => {
            if (resp === 'Success') {
                document.getElementById("new-post").value = "";
                loadHome();
            }
        });
}

const loadHome = () => {
    fetch(`http://localhost:3000/api/user`)
        .then(resp => resp.json())
        .then(resp => {
            document.getElementById("name").innerHTML = `${resp.fullname}`;
        })
    fetch(`http://localhost:3000/api/posts`)
        .then(resp => resp.json())
        .then(resp => {
            if (resp.location) {
                window.location.href = resp.location;
                return;
            }
            const container = document.getElementById("parent-post");
            if (resp.post.length) {
                container.innerHTML = ``;
                resp.post.map((post, index) => {
                    container.innerHTML += `
                    <div class="card" style="margin: 2% 30% 2% 30%;">
                        <div class="card-body" style="background-color:  rgb(238, 238, 238); padding: 10px 20px 10px 20px;">
                            <h4 style="font-family: 'Passion One', cursive;">#Post ${index + 1}</h4>
                            <p style="background-color: white;font-family: 'Quicksand', sans-serif;">${post}</p>
                        </div>
                    </div>
                    `;
                })
            }
            else {
                container.innerHTML = `
                <div class="card" style="margin: 2% 30% 2% 30%;">
                    <div class="card-body" style="background-color:  rgb(238, 238, 238); padding: 10px 20px 10px 20px;">
                        <h4 style="font-family: 'Passion One', cursive;">You haven't posted anything yet...</h4>
                    </div>
                </div>
                `;
            }
        });
}






