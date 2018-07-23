import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Card from '../components/Card';

class Root extends Component {
  static propTypes = {
    cardList: PropTypes.array,
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
  };

  static defaultProps = {
    cardList: [],
  };

  componentDidMount() {
    const { actions: { initCards } } = this.props;
    initCards();
  }

  render() {
    const { cardList } = this.props;
    return (
      <React.Fragment>
        {cardList.map(card => (
          <Card
            {...card}
            key={card.id}
          />
        ))}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => state.cards;

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Root);
