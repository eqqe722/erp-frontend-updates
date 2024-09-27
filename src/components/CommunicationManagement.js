import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Input, Select, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const CommunicationManagement = () => {
  const { t } = useTranslation();
  const [communications, setCommunications] = useState([]);
  const [newCommunication, setNewCommunication] = useState({
    stakeholder: '',
    communication_channel: '',
    frequency: '',
    responsible_party: '',
    message_purpose: ''
  });
  const toast = useToast();

  useEffect(() => {
    fetchCommunications();
  }, []);

  const fetchCommunications = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await axios.get('http://127.0.0.1:8000/communication-plans', {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the request headers
        }
      });
      setCommunications(response.data);
    } catch (error) {
      console.error('Error fetching communications:', error);
      toast({
        title: t('Error fetching communications'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommunication({ ...newCommunication, [name]: value });
  };

  const addCommunication = async () => {
    if (Object.values(newCommunication).some(value => value === '')) {
      toast({
        title: t('All fields are required'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await axios.post('http://127.0.0.1:8000/communication-plans', newCommunication, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the request headers
        }
      });
      setCommunications([...communications, response.data]);
      setNewCommunication({ stakeholder: '', communication_channel: '', frequency: '', responsible_party: '', message_purpose: '' });
      toast({
        title: t('Communication plan added'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding communication:', error);
      toast({
        title: t('Error adding communication plan'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        {t('Project Communication Management Plan')}
      </Heading>
      <Box mb={4}>
        <Input
          placeholder={t('Stakeholder')}
          name="stakeholder"
          value={newCommunication.stakeholder}
          onChange={handleInputChange}
          mb={2}
        />
        <Select
          placeholder={t('Communication Channel')}
          name="communication_channel"
          value={newCommunication.communication_channel}
          onChange={handleInputChange}
          mb={2}
        >
          <option value="email">{t('Email')}</option>
          <option value="meeting">{t('Meeting')}</option>
          <option value="report">{t('Report')}</option>
          <option value="call">{t('Phone Call')}</option>
        </Select>
        <Select
          placeholder={t('Frequency')}
          name="frequency"
          value={newCommunication.frequency}
          onChange={handleInputChange}
          mb={2}
        >
          <option value="daily">{t('Daily')}</option>
          <option value="weekly">{t('Weekly')}</option>
          <option value="biweekly">{t('Bi-weekly')}</option>
          <option value="monthly">{t('Monthly')}</option>
        </Select>
        <Input
          placeholder={t('Responsible Party')}
          name="responsible_party"
          value={newCommunication.responsible_party}
          onChange={handleInputChange}
          mb={2}
        />
        <Input
          placeholder={t('Message/Purpose')}
          name="message_purpose"
          value={newCommunication.message_purpose}
          onChange={handleInputChange}
          mb={2}
        />
        <Button onClick={addCommunication} colorScheme="blue">
          {t('Add Communication Plan')}
        </Button>
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{t('Stakeholder')}</Th>
            <Th>{t('Channel')}</Th>
            <Th>{t('Frequency')}</Th>
            <Th>{t('Responsible')}</Th>
            <Th>{t('Message/Purpose')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {communications.map((comm) => (
            <Tr key={comm.id}>
              <Td>{comm.stakeholder}</Td>
              <Td>{t(comm.communication_channel)}</Td>
              <Td>{t(comm.frequency)}</Td>
              <Td>{comm.responsible_party}</Td>
              <Td>{comm.message_purpose}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CommunicationManagement;
