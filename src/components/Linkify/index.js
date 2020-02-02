// edit from https://github.com/tasti/react-linkify thanks @tasti
import * as React from 'react';

import defaultComponentDecorator from './decorators/defaultComponentDecorator';
import defaultHrefDecorator from './decorators/defaultHrefDecorator';
import defaultMatchDecorator from './decorators/defaultMatchDecorator';
import defaultTextDecorator from './decorators/defaultTextDecorator';

class LinkifyWithTargetBlank extends React.Component {
  static defaultProps = {
    componentDecorator: defaultComponentDecorator,
    hrefDecorator: defaultHrefDecorator,
    matchDecorator: defaultMatchDecorator,
    textDecorator: defaultTextDecorator,
  };

  parseString(string) {
    if (string === '') {
      return string;
    }

    const matches = this.props.matchDecorator(string);
    if (!matches) {
      return string;
    }

    const elements = [];
    let lastIndex = 0;
    matches.forEach((match, i) => {
      // Push preceding text if there is any
      if (match.index > lastIndex) {
        elements.push(string.substring(lastIndex, match.index));
      }

      const decoratedHref = this.props.hrefDecorator(match.url);
      const decoratedText = this.props.textDecorator(match.text);
      const target = match.schema === 'mailto:' ? '_self' : '_blank';
      const decoratedComponent = this.props.componentDecorator(
        decoratedHref,
        decoratedText,
        i,
        target,
      );
      elements.push(decoratedComponent);

      lastIndex = match.lastIndex;
    });

    // Push remaining text if there is any
    if (string.length > lastIndex) {
      elements.push(string.substring(lastIndex));
    }

    return elements.length === 1 ? elements[0] : elements;
  }

  parse(children, key = 0) {
    if (typeof children === 'string') {
      return this.parseString(children);
    }
    if (React.isValidElement(children) && children.type !== 'a' && children.type !== 'button') {
      return React.cloneElement(children, { key }, this.parse(children.props.children));
    }
    if (Array.isArray(children)) {
      return children.map((child, i) => this.parse(child, i));
    }

    return children;
  }

  render() {
    return <React.Fragment>{this.parse(this.props.children)}</React.Fragment>;
  }
}

export default LinkifyWithTargetBlank;
