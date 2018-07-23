import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNmaes from 'classnames';
import { suits, numbers } from '../../constants/card';
import styles from './card.styl';

export default class Card extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    num: PropTypes.string,
    suit: PropTypes.string,
    pos: PropTypes.objectOf(PropTypes.number).isRequired,
    onClick: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { id, onClick } = this.props;
    onClick(id);
  }

  render = () => {
    const {
      pos: {
        x, y,
        rotation,
        rotateY,
      },
      num,
      suit,
    } = this.props;
    const isVisible = !rotateY;
    return (
      <div
        className={classNmaes(
          styles.card,
          styles[suits[suit]],
        )}
        style={{
          transform: `rotate(${rotation || 0}deg) translate(${x}px, ${y}px) rotateY(${rotateY}deg)`,
        }}
        role="button"
        tabIndex="0"
        onClick={isVisible ? this.handleClick : undefined}
      >
        {isVisible && (
          <div className={styles.front}>
            <div className={styles.num}>
              {numbers[num]}
            </div>
            <div className={styles.icon} />
          </div>
        )}
        <div className={styles.back} />
      </div>
    );
  }
}
