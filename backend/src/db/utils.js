const  colValueBinder = (object) => {
    // solo permitimos el tratamiento de objetos
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }
    // se obtienen, en arrays, tanto las keys (nombres de las columnas) como los values
    // por ejemplo cuando reciba el objeto {email: "anasus@gmail.com"}
    // columns = ["email"]
    // values = ["anasus@gmail.com"]
    const columns = Object.keys(object);
    const values = Object.values(object);

    // column set sera un string del tipo "email = ?, otraCol = ?" de modo
    // que se pueda hacer el bind con los values
    const colString = columns.map(column => `${column} = ?`).join(', ');

    // devolvemos un objeto del tipo {columnSet: "email = ?", values: ["anasus@gmail.com"]}
    return {
        colString,
        values
    }
}

export { colValueBinder }
