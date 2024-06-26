function validateForm() {
    var citizenId = document.getElementById('citizenId').value;
    if (citizenId.length !== 13) {
        alert("Citizen ID must be 13 digits long.");
        return false;
    }
    return true;
}
