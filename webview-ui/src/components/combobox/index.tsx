import { Combobox } from '@ark-ui/solid'
import { For } from 'solid-js'
import { Portal } from 'solid-js/web'
import type { JSX } from 'solid-js';
type Component<P = {
  items: string[]
}> = (props: P) => JSX.Element;

const Custom: Component = (props) => {
  const items = props.items || ['React', 'Solid', 'Vue'];
  return (
    <Combobox.Root items={items} multiple>
      <Combobox.Label>Framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.Trigger>Open</Combobox.Trigger>
        <Combobox.ClearTrigger>Clear</Combobox.ClearTrigger>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.ItemGroup id="framework">
              <Combobox.ItemGroupLabel for="framework">Frameworks</Combobox.ItemGroupLabel>
              <For each={items}>
                {(item) => (
                  <Combobox.Item item={item}>
                    <Combobox.ItemText>{item}</Combobox.ItemText>
                    <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </For>
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

export default Custom