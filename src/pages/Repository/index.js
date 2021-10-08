import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { Loading, Owner, IssueList } from './styles';
import Container from '../../components/container';

class Repository extends Component {
  constructor() {
    super();
    this.state = {
      repository: {},
      issues: [],
      loading: true,
    };
  }

  async componentDidMount() {
    const { match } = this.props;

    const repositoryName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`repos/${repositoryName}`),
      api.get(`repos/${repositoryName}`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading } = this.state;
    console.log(issues);
    if (loading) {
      return <Loading>carregando</Loading>;
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <IssueList>
          {issues.map((issue) => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                </strong>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};

export default Repository;
