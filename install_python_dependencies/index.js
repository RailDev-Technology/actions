const { setFailed, startGroup, endGroup, getInput } = require('@actions/core');
const { exec } = require('@actions/exec');
const { which } = require('@actions/io');

const { existsSync } = require('fs');
const { resolve } = require('path');

const WORKSPACE = process.env.GITHUB_WORKSPACE;

async function run() {
    try {
        const requirementsLocation = resolve(WORKSPACE, getInput('requirements'));
        if (!existsSync(requirementsLocation))
            setFailed(`Specified requirements.txt (${requirementsLocation}) does not exist!`);

        const pythonExe = await which('python');

        startGroup('Ensure Latest Version of Pip is Installed');
        await exec(`${pythonExe} -m pip install --upgrade pip`);
        endGroup();

        startGroup('Install Python Dependencies From requirements.txt');
        await exec(`${pythonExe} -m pip install -r ${requirementsLocation}`);
        endGroup();
    } catch (error) {
        setFailed(error.message);
    }
}

run();
