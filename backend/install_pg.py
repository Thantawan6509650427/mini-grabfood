import urllib.request
import json
import os
import tarfile
import shutil
import zipfile

def download_and_extract_package(package_name, version=None):
    """Download and extract npm package"""
    try:
        url = f'https://registry.npmjs.org/{package_name}'
        if version:
            url += f'/{version}'
        else:
            url += '/latest'

        print(f"Downloading {package_name} info...")
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            tarball_url = data['dist']['tarball']
            print(f'Downloading {package_name} from: {tarball_url}')

            # Download tarball
            with urllib.request.urlopen(tarball_url) as tar_response:
                tarball_path = f'{package_name}.tgz'
                with open(tarball_path, 'wb') as f:
                    f.write(tar_response.read())
            print(f'Downloaded {tarball_path}')

            # Extract
            print(f"Extracting {package_name} package...")
            extract_dir = f'temp_{package_name}'
            with tarfile.open(tarball_path, 'r:gz') as tar:
                tar.extractall(extract_dir)
            print(f'Extracted {package_name} package')

            # Copy to node_modules
            package_dir = f'node_modules/{package_name}'
            if os.path.exists(package_dir):
                shutil.rmtree(package_dir)
            if os.path.exists(f'{extract_dir}/package'):
                shutil.move(f'{extract_dir}/package', package_dir)
            print(f'Installed {package_name} to node_modules')

            # Cleanup
            if os.path.exists(tarball_path):
                os.remove(tarball_path)
            if os.path.exists(extract_dir):
                shutil.rmtree(extract_dir)

            return True

    except Exception as e:
        print(f'Failed to install {package_name}: {e}')
        return False

def install_pg_with_deps():
    """Install pg and its dependencies"""
    packages = [
        'pg-types',
        'pg-protocol',
        'pgpass',
        'pg-connection-string',
        'pg-pool',
        'pg'
    ]

    for package in packages:
        if not download_and_extract_package(package):
            print(f"Failed to install {package}, stopping...")
            return False

    print("All pg dependencies installed successfully!")
    return True

if __name__ == "__main__":
    install_pg_with_deps()