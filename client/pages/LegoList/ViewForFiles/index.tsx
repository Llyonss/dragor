import type { Component } from "solid-js";
import { createSignal, onMount, Show } from 'solid-js'
import { vscode } from "../../../utilities/vscode";
import { DTreeView } from '../../../components'


function camelCase(str) {
    const nameList = str.split('/');
    return nameList[nameList.length - 1].replace(/[-_]([a-z])/g, function (match, group1) {
        return group1.toUpperCase();
    });
}
function findName(item) {
    const name = item.title?.split('.')[0]
    if (['default', 'index'].includes(name)) {
        return findName(item.parent)
    }
    return name
}
const handleDrag = (event: any, type: any, item: any) => {
    const name = camelCase(findName(item));

    const code = item.meta.returnType === 'JSXElement' ? `<${name}></${name}>` : name
    event.dataTransfer.setData('text/plain', code);
    vscode.postMessage({
        command: `lego.list.drag.${type}`, data: JSON.parse(JSON.stringify({
            name,
            code,
            source: { from: item.from, import: item.title === 'default' ? name : `{ ${name} }` },
        }))
    });
}
const LegoList: Component = () => {
    const [getDirectory, setDirectory] = createSignal([])
    vscode.call('lego.list.workspace', {}).then((res: any) => {
        console.log('workspace', res)
        setDirectory(res)
    })

    return (
        <>
            <DTreeView
                data={getDirectory()}
                load={async (item) => {
                    if (item.fileType === 'File') {
                        const res = await vscode.call('lego.list.file', JSON.parse(JSON.stringify(item)));
                        return res
                    }
                    if (item.fileType === 'Directory') {
                        const res = await vscode.call('lego.list.directory', JSON.parse(JSON.stringify(item)));
                        return res
                    }
                    return item?.children || []
                }}
                node={(item: any) => (
                    <div
                        style={item.fileType === 'Export' ? 'color:var(--link-active-foreground);cursor: grab;' : ''}
                        draggable={true}
                        // onDblClick={() => {
                        //     vscode.call('lego.list.file.open', item);
                        // }}
                        onDragStart={(event: any) => { handleDrag(event, 'start', item) }}
                        onDragEnd={(event: any) => { handleDrag('end', event, item) }}
                    >
                        <Show when={item.fileType === 'Export'} ><i class="fa fa-external-link" style="margin-right:4px;"></i></Show>
                        <Show when={item.fileType === 'File'}><i class="fa fa-file-code-o" style="margin-right:4px;"></i></Show>
                        <Show when={item.fileType === 'Directory'}><i class="fa fa-folder-o" style="margin-right:4px;"></i></Show>
                        <span >
                            {item.title}{item.fileType === 'Export' && (`(${item?.meta?.returnType})` || '')}
                        </span>
                    </div>
                )}
            ></DTreeView>
        </>

    );
};

export default LegoList;
