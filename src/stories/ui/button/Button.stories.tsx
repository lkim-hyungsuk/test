import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '../../../ui/Button';

export default {
  title: 'Button/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args}>Click me</Button>;

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  type: 'tertiary',
};

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
  type: 'primary',
  disabled: true,
};

export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
  type: 'secondary',
  disabled: true,
};

export const TertiaryDisabled = Template.bind({});
TertiaryDisabled.args = {
  type: 'tertiary',
  disabled: true,
};
