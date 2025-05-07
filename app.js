const apiUrl = 'http://localhost:3000/records';

async function fetchRecords() {
    const response = await fetch(apiUrl);
    const records = await response.json();
    const list = document.getElementById('recordsList');
    list.innerHTML = '';

    records.forEach(record => {
        const item = document.createElement('li');
        item.textContent = `${record.name}: ${record.description}`;

        // Botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = async () => {
            await fetch(`${apiUrl}/${record.id}`, { method: 'DELETE' });
            fetchRecords();
        };

        // Botón de editar
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.onclick = () => {
            document.getElementById('name').value = record.name;
            document.getElementById('description').value = record.description;
            document.getElementById('recordForm').onsubmit = async (event) => {
                event.preventDefault();
                await fetch(`${apiUrl}/${record.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: document.getElementById('name').value,
                        description: document.getElementById('description').value
                    })
                });
                fetchRecords();
            };
        };

        item.appendChild(editBtn);
        item.appendChild(deleteBtn);
        list.appendChild(item);
    });
}

document.getElementById('recordForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
    });
    fetchRecords();
});

fetchRecords();