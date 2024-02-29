const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
require('console.table');

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db',
    });

    await employees(connection);
}

async function employees(connection) {
    let exitLoop = false;
    while (!exitLoop) {
        const { action } = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'View all roles',
                'View all departments',
                'Add an employee',
                'Add a role',
                'Add a department',
                'Update an employee role',
                'Exit'
            ],
        });

        switch (action) {
            case 'View all employees':
                await viewEmployees(connection);
                break;
            case 'View all roles':
                await viewRoles(connection);
                break;
            case 'View all departments':
                await viewDepartments(connection);
                break;
            case 'Add an employee':
                await addEmployee(connection);
                break;
            case 'Add a role':
                await addRole(connection);
                break;
            case 'Add a department':
                await addDepartment(connection);
                break;
            case 'Update an employee role':
                await updateRole(connection);
                break;
            case 'Exit':
                exitLoop = true;
                break;
        }
    }
    await connection.end();
}

async function viewEmployees(connection) {
    const [rows] = await connection.query('SELECT * FROM employees');
    console.table(rows);
}

async function viewRoles(connection) {
    const [rows] = await connection.query('SELECT * FROM roles');
    console.table(rows);
}

async function viewDepartments(connection) {
    const [rows] = await connection.query('SELECT * FROM departments');
    console.table(rows);
}



main().catch(err => console.error(err));