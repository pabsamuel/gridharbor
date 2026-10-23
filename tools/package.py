from pathlib import Path
import zipfile,hashlib,json
root=Path(__file__).resolve().parents[1];out=root/'dist';out.mkdir(exist_ok=True)
files={p.relative_to(root/'extension').as_posix():p for p in (root/'extension').rglob('*') if p.is_file() and p.name!='package.json'};files['LICENSE']=root/'LICENSE'
manifest=json.loads(files['manifest.json'].read_text(encoding='utf-8-sig'))
assert manifest['manifest_version']==3 and not manifest.get('host_permissions')
for value in manifest['icons'].values():assert value in files
for entry in ('workbench.html','workbench.js','workbench.css','license.js','public-key.js',manifest['background']['service_worker']):assert entry in files
archive=out/'gridharbor-0.1.0.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for name,p in sorted(files.items()):
  info=zipfile.ZipInfo(name,(2026,10,23,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,p.read_bytes())
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 assert not any(x.startswith(('.secrets','tests','research')) or x.endswith(('.key','.jwk')) for x in z.namelist())
print(f'PASS package: {len(files)} files, {archive.stat().st_size} bytes, SHA256 {hashlib.sha256(archive.read_bytes()).hexdigest()}')
