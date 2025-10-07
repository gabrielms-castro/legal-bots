import { promises as fs } from 'fs';

export async function displayExtensions(extensionsDirectory: string): Promise<string[]> {
    try {
        const entries = await fs.readdir(extensionsDirectory, { withFileTypes: true });
        const extensions = entries
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);
        return extensions
    } catch (error) {
        console.log(`Erro ao listar extensões: ${error}`);
        return[]
    }
}

export function loadExtension() {
}

function copyExtensionDir() {
}