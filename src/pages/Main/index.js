import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import {Link} from 'react-router-dom';

import api from '../../services/api';
import {Form, SubmitButton, List } from './styles';
import Container from '../../components/container';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      newRepository: '',
      repositories: [],
      loading: false,
    };
  }

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    if(repositories){
      this.setState({ repositories: JSON.parse(repositories) });
    }

  }

  componentDidUpdate(_, prevState) {
    const {repositories} = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories',JSON.stringify(repositories));
    }
  }

  handleInputChange = (e) => {
    this.setState({ newRepository: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { newRepository, repositories } = this.state;

    this.setState({ loading: true });

    const response = await api.get(`repos/${newRepository}`);

    const data = {
      name: response.data.full_name,
    };

    this.setState({
      repositories: [...repositories, data],
      newRepository: '',
      loading: false,
    });
  };

  render() {
    const { newRepository, loading, repositories } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar Repositório"
            value={newRepository}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map((repository) => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default Main;
