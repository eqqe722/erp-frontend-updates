import React, { useState } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Input, Select, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const CommunicationManagement = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [communications, setCommunications] = useState([]);
  const [newCommunication, setNewCommunication] = useState({
    stakeholder: '',
    channel: '',
    frequency: '',
    responsible: '',
    message: ''
  });
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommunication({ ...newCommunication, [name]: value });
  };

  const addCommunication = () => {
    if (Object.values(newCommunication).some(value => value === '')) {
      toast({
        title: t('All fields are required'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setCommunications([...communications, { ...newCommunication, id: Date.now() }]);
    setNewCommunication({ stakeholder: '', channel: '', frequency: '', responsible: '', message: '' });
    toast({
      title: t('Communication plan added'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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
          name="channel"
          value={newCommunication.channel}
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
          name="responsible"
          value={newCommunication.responsible}
          onChange={handleInputChange}
          mb={2}
        />
        <Input
          placeholder={t('Message/Purpose')}
          name="message"
          value={newCommunication.message}
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
              <Td>{t(comm.channel)}</Td>
              <Td>{t(comm.frequency)}</Td>
              <Td>{comm.responsible}</Td>
              <Td>{comm.message}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CommunicationManagement;
