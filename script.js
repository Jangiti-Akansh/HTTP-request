window.onload = async function() {
    var addu = document.getElementById("addUser");
    var adding = document.getElementById("modalAddUser");
    var addbut = document.getElementById("addUserButton");
    var cancbut = document.querySelector(".deleteCancel");
    addu.addEventListener("click", function() {
        adding.classList.add("show");
        adding.style.display = "block";
        document.getElementById("inputName").value = "";
        document.getElementById("inputAge").value = "";
        document.getElementById("inputState").selectedIndex = 0; 
        addbut.removeEventListener("click", updateU);
        addbut.addEventListener("click", addUs);
    });
    addbut.addEventListener("click", addUs);
    window.addEventListener("click", function(event) {
        if (event.target == adding) {
            adding.style.display = "none";
        }
    });
    cancbut.addEventListener("click", function() {
        var del = document.getElementById("modalAddUser");
        del.style.display = "none";
    });
    fetchU();
};


async function addUs() {
    var nain = document.getElementById("inputName").value;
    var agin = document.getElementById("inputAge").value;
    var stin = document.getElementById("inputState").value;
    if (!nain || !agin || !stin) {
        alert("Fill in all the fields.");
        return;
    }

    var newus = {
        Name: nain,
        Age: agin,
        State: stin
    };
    var resp = await fetch("https://65fb162b14650eb210094e5f.mockapi.io/ajjaxx/api/v1/Assignemt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newus)
    });
    if (resp.status === 201) {
        await fetchU();
        var adding = document.getElementById("modalAddUser");
        adding.style.display = "none";
        alert("User added successfully!");
    }
}

async function fetchU() {
    var resp = await fetch("https://65fb162b14650eb210094e5f.mockapi.io/ajjaxx/api/v1/Assignemt");
    var userinfo = await resp.json();
    loadU(userinfo);
}


function loadU(userinfo) {
    var tabb = document.getElementById("table").getElementsByTagName('tbody')[0];
    var tabh = document.getElementById("tableHeadings");
    tabb.innerHTML = '';
    userinfo.forEach(function(userData) {
        var rem = tabb.insertRow();
        rem.id = "user" + userData.id;
        var inname = rem.insertCell(0);
        var inage = rem.insertCell(1);
        var instate = rem.insertCell(2);
        var infun = rem.insertCell(3);
        inname.innerText = userData.Name;
        inage.innerText = userData.Age;
        instate.innerText = userData.State;
        var load = document.createElement("button");
        load.className = "edit";
        load.innerHTML = '<i class="bi bi-pencil"></i>';
        load.addEventListener("click", function() { editU(userData); });
        infun.appendChild(load);
        var deleting = document.createElement("button");
        deleting.className = "deleteB";
        deleting.innerHTML = '<i class="bi bi-trash"></i>';
        deleting.addEventListener("click", function() { deleteU(userData); });
        infun.appendChild(deleting);
    });
    tabb.insertBefore(tabh.cloneNode(true), tabb.firstChild);
}


async function editU(userData) {
    var usro = document.getElementById("user" + userData.id);
    usro.cells[0].innerHTML = '<input type="text" id="editName" value="' + userData.Name + '">';
    usro.cells[1].innerHTML = '<input type="text" id="editAge" value="' + userData.Age + '">';
    usro.cells[2].innerHTML = '<input type="text" id="editState" value="' + userData.State + '">';
    var save = document.createElement("button");
    save.innerText = "Save";
    save.addEventListener("click", async function() {
        var newna = document.getElementById("editName").value;
        var neage = document.getElementById("editAge").value;
        var newsta = document.getElementById("editState").value;
        if (!newna || !neage || !newsta) {
            alert("Fill in all the fields.");
            return;
        }

        await updateU(userData.id, newna, neage, newsta);
        usro.cells[3].removeChild(save);
    });
    usro.cells[3].innerHTML = '';
    usro.cells[3].appendChild(save);
}


async function updateU(userId, newna, neage, newsta) {
    var userupd = {
        Name: newna,
        Age: neage,
        State: newsta
    };
    var resp = await fetch("https://65fb162b14650eb210094e5f.mockapi.io/ajjaxx/api/v1/Assignemt/" + userId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userupd)
    });
    if (resp.ok) {
        var usro = document.getElementById("user" + userId);
        usro.cells[0].innerText = newna;
        usro.cells[1].innerText = neage;
        usro.cells[2].innerText = newsta;
        var edbut = document.createElement("button");
        edbut.className = "edit";
        edbut.innerHTML = '<i class="bi bi-pencil"></i>';
        edbut.addEventListener("click", function() { editU({id: userId, Name: newna, Age: neage, State: newsta}); });
        usro.cells[3].appendChild(edbut);
        var delbut = document.createElement("button");
        delbut.className = "deleteB";
        delbut.innerHTML = '<i class="bi bi-trash"></i>';
        delbut.addEventListener("click", function() { deleteU({id: userId, Name: newna}); });
        usro.cells[3].appendChild(delbut);
    }
}


async function deleteU(userData) {
    var del = document.getElementById("deleteModal");
    del.classList.add("show");
    del.style.display = "block";
    var userdel = document.getElementById("userDeleted");
    userdel.innerText = userData.Name;
    var cancelDelete = document.querySelectorAll(".deleteCancel");
    cancelDelete.forEach(function(btn) {
        btn.addEventListener("click", function() {
            del.style.display = "none";
        });
    });
    var delsuc = document.querySelector(".confirmDelete");
    delsuc.onclick = async function() {
        await fetch("https://65fb162b14650eb210094e5f.mockapi.io/ajjaxx/api/v1/Assignemt/" + userData.id, {
            method: "DELETE"
        });
        var delele = document.getElementById("user" + userData.id);
        if (delele) {
            delele.remove();
            alert("User deleted successfully!");
        }
        del.style.display = "none";
    };
}

