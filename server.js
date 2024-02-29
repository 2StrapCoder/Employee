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

async function addDepartment() {
    try {
        const { departmentName } = await inquirer.prompt({
            name: 'departmentName',
            type: 'input',
            message: 'What is the name of the department?'
        });

        await connection.query('INSERT INTO departments SET ?', { name: departmentName });
        console.log('Department added!');
        await employees();
    } catch (err) {
        console.error(err);
    }
}

async function addRole() {
    try {
        const [departments] = await connection.query('SELECT * FROM departments');
        const answers = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the name of the role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the role?',
                validate: value => !isNaN(value)
            },
            {
                name: 'departmentId',
                type: 'list',
                choices: departments.map(department => ({ name: department.name, value: department.id })),
                message: 'Which department does this role belong to?'
            }
        ]);

        await connection.query('INSERT INTO roles SET ?', {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.departmentId
        });

        console.log('Role added successfully');
        await employees();
    } catch (err) {
        console.error(err);
    }
}



main().catch(err => console.error(err));